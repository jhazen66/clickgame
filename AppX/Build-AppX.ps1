#
#  BuildAppX.ps1
#  
#  Must be called from the project's root directory, due to the use of relative file paths.
#
#  This script handles the packaging, signing, and local deployment of an AppX project using the Windows SDK.
#
Param(
    [string]$appXDirectory = (split-path -parent $MyInvocation.MyCommand.Definition),
    [string]$appDirectory = (join-path (split-path -parent $appXDirectory) 'app'),
    [string]$buildDirectory = (join-path $appXDirectory 'dist'),
    [switch]$sign = $false
);

# Add windows sdk to path (if you are running 8.0 or x86, you may need to change this)
$env:Path += ";" + (Join-Path ${Env:ProgramFiles(x86)} "Windows Kits\8.1\bin\x64\");

# Helper function to search the AppXManifest file.
function Get-AppXManifestInfo($regex) {
    (Get-Content (join-path $appxDirectory 'AppxManifest.xml') -raw) -imatch $regex | Out-Null;
    $matches[0]; 
}

# Uses regex to find the AppX display name (used as the .AppX filename)
$appXDisplayName = Get-AppXManifestInfo '(?<=<DisplayName>)(.+?)(?=</DisplayName>)'

if ($sign) {
    $appXPackageFile = (Join-Path $buildDirectory ("{0}.appx" -f $appxDisplayName));

    # Make AppX package using the mapping file at the project's root directory.
    makeappx pack /o /f (Join-Path $appxDirectory 'mappingfile.txt') /p $appXPackageFile;

    # Uses regex to find the publisher name inside the appx manifest file.
    $publisher = Get-AppXManifestInfo '(?<=Publisher=")(.+?)(?=".+)';

    # All keys (regardless of extension) are stored using the same base name in the keys directory under the build directory.
    # A ".gitignore" file is in that folder so none of the keys will ever be checked into source control.
    $keyName = Join-Path $appxDirectory ('keys\{0}-{1}' -f [Environment]::MachineName, [Environment]::UserName.Replace(" ", ""));

    # Get all the installed certificates under "Trusted People"
    $certs = certutil -store TrustedPeople 2>$1;

    # If a root certificate matching the publisher name listed in the AppXManifest file is not found, then create and install it.
    if ($false -eq ($certs -imatch "^Issuer:\ $publisher")) {
        # Create self signed root certificate with the issuer equal to the one defined in the appxmanifest.xml file:
        makecert -n $publisher -r -h 0 -eku "1.3.6.1.5.5.7.3.3,1.3.6.1.4.1.311.10.3.13" -m 6 -sv "$keyName.pvk" "$keyName.cer";
        certutil -addStore TrustedPeople "$keyName.cer";

        # Convert the pvk certificate file into a pfx file
        pvk2pfx /pvk "$keyName.pvk" /spc "$keyName.cer" /pfx "$keyName.pfx" 2>$1;
    }

    # Sign the package using the pfx key that should at this point be in the keys folder.
    signtool.exe sign /fd SHA256 /a /f "$keyName.pfx" $appXPackageFile;

    # Remove any applications that are installed with the same display name (this serves to remove your last build before installing *this* one)
    $oldPackage = Get-AppxPackage -Name $appXDisplayName;
    if ($NULL -ne $oldPackage) {
        $oldPackage | % { $_ | Remove-AppxPackage; }
    }
    
    Add-AppxPackage -Path $appXPackageFile;
} else {
    Get-AppXPackage | ? { $_.Name -eq $appXDisplayName } | % {
        $_ | Remove-AppxPackage
    }

    if (Test-Path $buildDirectory) {
        Remove-Item -LiteralPath $buildDirectory -Force -Recurse;
    } 
    
    New-Item -ItemType Directory $buildDirectory -Force | Out-Null;
    
    Get-ChildItem -LiteralPath $appDirectory | % {
        Copy-Item -LiteralPath $_.FullName -Recurse -Force -Destination $buildDirectory;
    }

    Copy-Item -LiteralPath (Join-Path $appxDirectory 'AppxManifest.xml') -Destination $buildDirectory;

    Add-AppxPackage -Register -Path (Join-Path $buildDirectory 'AppxManifest.xml');
}


