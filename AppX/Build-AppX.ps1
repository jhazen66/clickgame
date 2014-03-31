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

[xml]$appxManifest = Get-Content "$appxDirectory\AppxManifest.xml";
$appXDisplayName = $appxManifest.Package.Properties.DisplayName;
$publisher = $appxManifest.Package.Properties.PublisherDisplayName;
$appXPackageFile = "$buildDirectory\$appxDisplayName.appx";

# Remove any applications that are installed with the same display name (this serves to remove your last build before installing *this* one)
Get-AppxPackage -Name "$appXDisplayName*" | Remove-AppxPackage;

# Recreating the build directory clears the old one. 
New-Item -ItemType Directory $buildDirectory -Force | Out-Null;
 
if ($sign) {

    $mappingFile = Join-Path $appXDirectory 'mappingfile.txt';
    if (Test-Path $mappingFile) {
        Push-Location (split-path -parent $mappingFile);
        makeappx pack /o /f $mappingFile /p $appXPackageFile;
        Pop-Location;
    }

    # All keys (regardless of extension) are stored using the same base name in the keys directory under the build directory.
    # A ".gitignore" file is in that folder so none of the keys will ever be checked into source control.
    $keyName = Join-Path $appxDirectory ('keys\{0}-{1}' -f $env:COMPUTERNAME, ($env:UserName -replace '\ ', ''));

    # If a root certificate matching the publisher name listed in the AppXManifest file is not found, then create and install it.
     # Get all the installed certificates under "Trusted People"
    $certs = certutil -store TrustedPeople 2>$1;

    if (-not ($certs -imatch "^Issuer:\ $publisher") -or -not (Test-Path "$keyName.pfx")) {
        Start-Process powershell.exe -verb runas -ArgumentList ("-noexit $appxDirectory\Sign-AppxPackage.ps1 -publisher '{0}' -keyName '{1}'" -f $publisher, $keyName)  -Wait;
    }    
        
    signtool.exe sign /fd SHA256 /a /f "$keyName.pfx" $appXPackageFile;

    Add-AppxPackage -Path $appXPackageFile;
} else {
    Copy-Item "$appxDirectory\AppxManifest.xml", "$appDirectory\*" $buildDirectory -Recurse -Force

    Add-AppxPackage -Register -Path "$buildDirectory\AppxManifest.xml";
}

$appXPackage = (Get-AppxPackage -Name "$appXDisplayName*");

Invoke-Command { (Get-AppXPackage clickgame | .\Launch-AppxPackage.ps1) }