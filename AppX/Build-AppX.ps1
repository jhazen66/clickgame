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


$code = @"
using System;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
namespace Win8 {
    public enum ActivateOptions
    {
        None = 0x00000000,  // No flags set
        DesignMode = 0x00000001,
        NoErrorUI = 0x00000002,  // Do not show an error dialog if the app fails to activate.                                
        NoSplashScreen = 0x00000004,  // Do not show the splash screen when activating the app.
    }

    [ComImport, Guid("2e941141-7f97-4756-ba1d-9decde894a3d"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IApplicationActivationManager
    {
        // Activates the specified immersive application for the "Launch" contract, passing the provided arguments
        // string into the application.  Callers can obtain the process Id of the application instance fulfilling this contract.
        IntPtr ActivateApplication([In] String appUserModelId, [In] String arguments, [In] ActivateOptions options, [Out] out UInt32 processId);
        IntPtr ActivateForFile([In] String appUserModelId, [In] IntPtr /*IShellItemArray* */ itemArray, [In] String verb, [Out] out UInt32 processId);
        IntPtr ActivateForProtocol([In] String appUserModelId, [In] IntPtr /* IShellItemArray* */itemArray, [Out] out UInt32 processId);
    }

    [ComImport, Guid("45BA127D-10A8-46EA-8AB7-56EA9078943C")]
    public class ApplicationActivationManager : IApplicationActivationManager
    {
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)/*, PreserveSig*/]
        public extern IntPtr ActivateApplication([In] String appUserModelId, [In] String arguments, [In] ActivateOptions options, [Out] out UInt32 processId);
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        public extern IntPtr ActivateForFile([In] String appUserModelId, [In] IntPtr /*IShellItemArray* */ itemArray, [In] String verb, [Out] out UInt32 processId);
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        public extern IntPtr ActivateForProtocol([In] String appUserModelId, [In] IntPtr /* IShellItemArray* */itemArray, [Out] out UInt32 processId);
    }
}
"@

Add-Type -TypeDefinition $code;
$AppLauncher = new-object Win8.ApplicationActivationManager

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

    # Get all the installed certificates under "Trusted People"
    $certs = certutil -store TrustedPeople 2>$1;
    
    # If a root certificate matching the publisher name listed in the AppXManifest file is not found, then create and install it.
    if (($certs -imatch "^Issuer:\ $publisher") -and (Test-Path "$keyName.pfx")) {
        # Sign the package using the pfx key that should at this point be in the keys folder.
        if (Test-Path "$keyName.pfx") {
            signtool.exe sign /fd SHA256 /a /f "$keyName.pfx" $appXPackageFile;
        } else {
            Write-Host -ForegroundColor Red ('Error: A certificate matching the name of the publisher listed in AppxManifest.xml is installed on this computer, but the corresponding pfx key seems to be missing from the keys folder.');
        }
    } else {
        # Create self signed root certificate with the issuer equal to the one defined in the appxmanifest.xml file:
        makecert -n $publisher -r -h 0 -eku "1.3.6.1.5.5.7.3.3,1.3.6.1.4.1.311.10.3.13" -m 6 -sv "$keyName.pvk" "$keyName.cer";

        certutil -addStore TrustedPeople "$keyName.cer";

        # Convert the pvk certificate file into a pfx file
        pvk2pfx /pvk "$keyName.pvk" /spc "$keyName.cer" /pfx "$keyName.pfx" 2>$1;
    }    
        
    Add-AppxPackage -Path $appXPackageFile;
} else {
    Copy-Item "$appxDirectory\AppxManifest.xml", "$appDirectory\*" $buildDirectory -Recurse -Force

    Add-AppxPackage -Register -Path "$buildDirectory\AppxManifest.xml";
}

$appXPackage = (Get-AppxPackage -Name "$appXDisplayName*");

$AppLauncher.ActivateApplication(('{0}!App' -f $appXPackage.PackageFamilyName), $null, [Win8.ActivateOptions]::None, [ref]0);