Param(
    [string]$appxDirectory = (split-path -parent $PSCommandPath),
    [string]$appDirectory = (Join-path (split-path -parent $appxDirectory) 'app'),
    [string]$buildDirectory = (Join-Path $appxDirectory 'dist')
);

[xml]$appxManifest = Get-Content "$appxDirectory\AppxManifest.xml";
$appXDisplayName = $appxManifest.Package.Properties.DisplayName;

Get-AppxPackage -Name $appXDisplayName | % {
    $_ | Remove-AppxPackage;
}

New-Item $buildDirectory -Force -ItemType Directory | Out-Null;

Copy-Item "$appxDirectory\AppxManifest.xml", "$appDirectory\*" $buildDirectory -Recurse -Force

Add-AppxPackage -Register -Path "$buildDirectory\AppxManifest.xml";

(Get-AppxPackage -Name $appXDisplayName | .\Launch-AppxPackage.ps1);