# Building AppX packages without Visual Studio #

Want to get started with Modern Windows apps without visual studio? Here's what you'll need to get started.

1. You need to be running Windows 8 or Windows 8.1.  
2. You need a Windows Developer License.  Read more about that [here](http://msdn.microsoft.com/en-us/library/windows/apps/hh974578.aspx).  In order to get the License from the command line, open an Administrative Powershell console and type:
 `Show-WindowsDeveloperLicenseRegistration` and follow the prompts.

That's it! That's all you need to get started hacking away. Down the road when you want to deploy your app to the Windows Store, you'll need to sign your *.appx package using the  [Microsoft Software Development Kit (SDK) for Windows 8.1](http://msdn.microsoft.com/en-US/windows/desktop/bg162891), but aside from that, you're all set!

## Build-AppX.ps1 ##

This PowerShell script automates packaging, signing, and deploying the *.appx package for this project.  It is easily adaptable for other projects, and can be run in two different ways:

1. Without any parameters,  `.\Build-AppX.ps1`, copies all required files and directories to the AppX/dist/ directory (the "build" directory) and registers the folder contents in place as an app package using the  `Add-AppxPackage -Register`  CmdLet.

2. If you call the app with the signing flag `.\Build-AppX.ps1 -sign`, then your web app will be packaged, compressed, and digitally signed with your certificate.  If valid certs and keys are not found in the keys directory, then you'll be prompted to create them before the build continues. In order for this to work you will need to have the aforementioned [SDK](http://msdn.microsoft.com/en-US/windows/desktop/bg162891) installed.

Both methods (1 and 2) of building your app will first remove any existing application with a conflicting name, and will attempt to launch the app upon completion. Note that in order for the application to successfully launch, you must call `Build-AppX.ps1` from a non-administrative context. This is due to the security model around Modern apps.

You can read more about how this process works [here](http://blogs.msdn.com/b/wsdevsol/archive/2014/02/12/create-a-windows-store-appx-package-and-sign-it.aspx). 

Note as well that makeappx consumes the mappingfile.txt which is used to define what files should be included in the AppX package.  This is a good reference one how [makeappx](http://msdn.microsoft.com/en-us/library/windows/desktop/hh446767(v=vs.85).aspx) works.


