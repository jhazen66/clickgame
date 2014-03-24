#
#  BuildAppX.ps1
#  
#  Must be called from the project's root directory, due to the use of relative file paths.
#
#  This script handles the packaging, signing, and local deployment of an AppX project using the Windows SDK.
#

$projectDirectory = Get-Item .\;

# Get the path to the windows sdk (if you are running 8.0 or x86, you may need to change this)
$sdkPath = ${Env:ProgramFiles(x86)} + "\Windows Kits\8.1\bin\x64\";

# Set alias' for specific windows sdk executables to use.
Set-Alias -Name "makecert" -Value ('{0}makecert.exe' -f $sdkPath);
Set-Alias -Name "pvk2pfx" -Value ('{0}pvk2pfx.exe' -f $sdkPath);
Set-Alias -Name "makeappx" -Value ('{0}makeappx.exe' -f $sdkPath);
Set-Alias -Name "signtool" -Value ('{0}signtool.exe' -f $sdkPath);

# Helper function to search the AppXManifest file.
function Get-AppXManifestInfo($regex) {
    (Get-Content ('{0}\AppX\appxmanifest.xml' -f $projectDirectory.FullName) -raw) -imatch $regex | Out-Null;
    $matches[0]; 
}

# Uses regex to find the AppX display name (used as the .AppX filename)
$appXDisplayName = Get-AppXManifestInfo '(?<=<DisplayName>)(.+?)(?=</DisplayName>)'

# Uses regex to find the publisher name inside the appx manifest file.
$publisher = Get-AppXManifestInfo '(?<=Publisher=")(.+?)(?=".+)';

# All keys (regardless of extension) are stored using the same base name in the keys directory under the build directory.
# A ".gitignore" file is in that folder so none of the keys will ever be checked into source control.
$keyName = ('{0}\AppX\keys\{1}-{2}' -f $projectDirectory, [Environment]::MachineName, [Environment]::UserName.Replace(" ", ""));

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

$appXPackageFile = ('{0}\AppX\dist\{1}.appx' -f $projectDirectory, $appXDisplayName);

# Make AppX package using the mapping file at the project's root directory.
makeappx pack /o /f "$projectDirectory\AppX\mappingfile.txt" /p $appXPackageFile;

# Sign the package using the pfx key that should at this point be in the keys folder.
signtool sign /fd SHA256 /a /f "$keyName.pfx" $appXPackageFile;

# Remove any applications that are installed with the same display name (this serves to remove your last build before installing *this* one)
$oldPackage = Get-AppxPackage -Name $appXDisplayName;
if ($NULL -ne $oldPackage) {
    $oldPackage | % { $_ | Remove-AppxPackage; }
}

Add-AppxPackage -Path $appXPackageFile;