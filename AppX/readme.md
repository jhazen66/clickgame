# Building AppX packages without Visual Studio #

So you don't really need Visual Studio to build AppX packages.  In some ways it is easier, but hey, not everyone wants or need those tools.  Plus being able to do it from the command line is handy and kinda cool.

Sooo....here is what to do:

1. You need to be running Windows 8 or Windows 8.1.  
2. You need a Windows Developer License.  Read more about that [here](http://msdn.microsoft.com/en-us/library/windows/apps/hh974578.aspx).  In order to get the License from the command line, open an Administrative Powershell console and type:
 `Show-WindowsDeveloperLicenseRegistration` and follow the prompts.
3. You need to install the [Microsoft Software Development Kit (SDK) for Windows 8.1](http://msdn.microsoft.com/en-US/windows/desktop/bg162891) - mostly you just need makeappx.exe that comes with this SDK.  

## Build-AppX.ps1 ##

This PowerShell script automates the process of packaging, signing, and deploying the AppX package for this project.  It is easily adaptable for other projects.  It can be run two ways:

1. Without any parameters,  `.\Build-AppX.ps1`, it simply copies all the required folders over to the AppX/dist/ folder and then calls `Add-AppxPackage -Register` to deploy the app on Windows 8 or Windows 8.1.  It removes any previously installed version.

2. If you call the app with the signing parameter, `.\Build-AppX.ps1 -sign`, then it will actually create the compressed AppX package, and sign it with your certificate.  If it cannot find appropriate keys, then you will be prompted to create the necessary keys. When running with the `-sign` parameter, you must use and **elevated** PowerShell prompt.

You can read more about how this process works [here](http://blogs.msdn.com/b/wsdevsol/archive/2014/02/12/create-a-windows-store-appx-package-and-sign-it.aspx). 

Note as well that makeappx consumes the mappingfile.txt which is used to define what files should be included in the AppX package.  This is a good reference one how [makeappx](http://msdn.microsoft.com/en-us/library/windows/desktop/hh446767(v=vs.85).aspx) works.


