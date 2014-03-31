#
#  Config-Sublime.ps1
#  
#  This script installs the Sublime Text 2 build systems I need for the demo.
#
Param(
    $scriptDirectory = (split-path -parent $MyInvocation.MyCommand.Definition),
    $sublimeBuildDirectory = (Join-Path (Join-Path $env:HOMEDRIVE $env:HOMEPATH ) 'AppData\Roaming\Sublime Text 2\Packages\User\' ),
    $chromeDirectory = (Join-Path $scriptDirectory 'ChromeApp'),
    $appxDirectory = (Join-Path $scriptDirectory 'appx')       
)

Copy-Item (Join-Path $chromeDirectory 'ChromeApp.sublime-build') $sublimeBuildDirectory;
Copy-Item (Join-Path $chromeDirectory 'sandbox.sublime-snippet') $sublimeBuildDirectory;
Copy-Item (Join-Path $appxDirectory 'AppX.sublime-build') $sublimeBuildDirectory;


Write-Host -ForegroundColor Green "+ Copied Sublime Config files to: `"$sublimeBuildDirectory`"";
