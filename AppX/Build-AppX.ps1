#
#  BuildAppX.ps1
#
#  This script handles the packaging, signing, and local deployment of an AppX project using the Windows SDK.
#  In order to launch an application (the final step this script takes), this script must be executed from a non-administrative
#  context. This is due to the security model around Modern Apps.
# 
Param(
    [string]$appXDirectory = (split-path -parent $MyInvocation.MyCommand.Definition),
    [string]$appDirectory = (join-path (split-path -parent $appXDirectory) 'app'),
    [string]$buildDirectory = (join-path $appXDirectory 'dist'),
    [switch]$sign = $false
);


# C# Implementation of the IApplicationActivationManager and related objects, allowing us to launch a modern app from 
# a powershell prompt. An important not about this is that Launch-AppXPackage must be called from a non-elevated context
# due to the security model around Modern Apps.
function Launch-AppXPackage {
    Param(
        [Parameter(Position=0, Mandatory=$true, ValueFromPipeline=$true)]
        $appxPackage
    )
    $code = @"
using System;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
namespace Win8 {
    public enum ActivateOptions
    {
        None = 0x00000000,
        DesignMode = 0x00000001,
        NoErrorUI = 0x00000002,
        NoSplashScreen = 0x00000004,
    }

    [ComImport, Guid("2e941141-7f97-4756-ba1d-9decde894a3d"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IApplicationActivationManager
    {
        IntPtr ActivateApplication([In] String appUserModelId, [In] String arguments, [In] ActivateOptions options, [Out] out UInt32 processId);
        IntPtr ActivateForFile([In] String appUserModelId, [In] IntPtr itemArray, [In] String verb, [Out] out UInt32 processId);
        IntPtr ActivateForProtocol([In] String appUserModelId, [In] IntPtr itemArray, [Out] out UInt32 processId);
    }

    [ComImport, Guid("45BA127D-10A8-46EA-8AB7-56EA9078943C")]
    public class ApplicationActivationManager : IApplicationActivationManager
    {
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)/*, PreserveSig*/]
        public extern IntPtr ActivateApplication([In] String appUserModelId, [In] String arguments, [In] ActivateOptions options, [Out] out UInt32 processId);
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        public extern IntPtr ActivateForFile([In] String appUserModelId, [In] IntPtr itemArray, [In] String verb, [Out] out UInt32 processId);
        [MethodImpl(MethodImplOptions.InternalCall, MethodCodeType = MethodCodeType.Runtime)]
        public extern IntPtr ActivateForProtocol([In] String appUserModelId, [In] IntPtr itemArray, [Out] out UInt32 processId);
    }
}
"@

    Add-Type -TypeDefinition $code;
    $AppLauncher = new-object Win8.ApplicationActivationManager

    # Launch the application normally.
    $AppLauncher.ActivateApplication(('{0}!App' -f $appxPackage.PackageFamilyName), $null, [Win8.ActivateOptions]::None, [ref]0);
}

# Add windows sdk to path (if you are running 8.0 or x86, you may need to change this)
$env:Path += ";" + (Join-Path ${Env:ProgramFiles(x86)} "Windows Kits\8.1\bin\x64\");

# Get the appxmanifest and any pertinent details we will need from it.
[xml]$appxManifest = Get-Content "$appxDirectory\AppxManifest.xml";
$appXDisplayName = $appxManifest.Package.Properties.DisplayName;
$publisher = $appxManifest.Package.Identity.Publisher;

# Remove any applications that are installed with the same display name (this serves to remove your last build before installing *this* one)
Get-AppxPackage -Name "$appXDisplayName*" | Remove-AppxPackage;

# Recreating the build directory clears the old one. 
New-Item -ItemType Directory $buildDirectory -Force | Out-Null;

if (-not $sign) {
    
    # Copy the contents of the app directory and the appxmanifest into the build directory
    Copy-Item "$appxDirectory\AppxManifest.xml", "$appDirectory\*" $buildDirectory -Recurse -Force

    # This adds the appxpackage in-place, without packaging or signing.
    Add-AppxPackage -Register -Path "$buildDirectory\AppxManifest.xml";
} else {
    # The intended filepath for the *.appx file we will be creating.
    $appXPackageFile = "$buildDirectory\$appxDisplayName.appx";

    # Using the mapping file allows us to make sure our appx package is only as big as it needs to be.
    $mappingFile = Join-Path $appXDirectory 'mappingfile.txt';
    if (Test-Path $mappingFile) {
        Push-Location (split-path -parent $mappingFile);
        makeappx pack /o /f $mappingFile /p $appXPackageFile;
        Pop-Location;
    }

    # All keys (regardless of extension) are stored using the same base-name in the keys directory under the build directory.
    # A ".gitignore" file is in that folder so none of the keys will ever be checked into source control.
    $keyName = Join-Path $appxDirectory ('keys\{0}-{1}' -f $env:COMPUTERNAME, ($env:UserName -replace '\ ', ''));

    # Get all the installed certificates under "Trusted People"
    $certs = certutil -store TrustedPeople 2>$1;

    # If there is no installed certificate that matches the publisher listed in the AppxManifest.xml file, OR 
    # if the private key file does not exist, then using an elevated powershell prompt create the proper certificate
    # files for appx signage.
    if (-not ($certs -imatch "^Issuer:\ $publisher") -or -not (Test-Path "$keyName.pfx")) {
        Start-Process powershell.exe -verb runas -ArgumentList ("$appxDirectory\Sign-AppxPackage.ps1 -publisher '{0}' -keyName '{1}'" -f $publisher, $keyName)  -Wait;
    }    
    
    # Sign the *.appx file using the generated private key.
    signtool.exe sign /fd SHA256 /a /f "$keyName.pfx" $appXPackageFile;

    # Deploy the signed appx package.
    Add-AppxPackage -Path $appXPackageFile;
}

# Finally, launch the appx package.
(Get-AppXPackage -Name $appXDisplayName | Launch-AppxPackage);