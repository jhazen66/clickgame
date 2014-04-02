# ClickGame #


## [//BUILD](http://buildwindows.com) Demo App ##


Play it [here!](https://clickgame.azurewebsites.net)

This repo has all the code and links to the material I used in [my talk at //BUILD 2014](http://msdn.microsoft.com/en-us/library/windows/apps/hh767331.aspx). See links to additional information and resources below.


## Features: ##

  1. click-to-earn - clicking the big round button allows a player to earn virtual game money
  2. click-to-buy - clicking on a button allows a player to buy an item, if they have enough money
  3. item-price-increase - when any item is purchased the price increases
  4. Save players inventory, virtual money, and clicks-per-second
  5. Ability to Reset Game
  6. Ability to cheat by getting free money
  7. Credits for for the great images from [The Noun Project](https://thenounproject.com)


## Tools and Libraries used: ##

  1. [Yeoman](http://yeoman.io) - scaffolding for webapp
  2. [Bootstrap](http://getbootstrap.com/) - responsive layout
  3. [Knockout](http://knockoutjs.com/) - data binding
  4. [jQuery](http://jquery.com/) - because jquery
  3. [Accounting.js](http://josscrowcroft.github.io/accounting.js/) - formatting money values
  4. Also using the [Microsoft Software Development Kit (SDK) for Windows 8.1](http://msdn.microsoft.com/en-US/windows/desktop/bg162891) - needed makeapp.exe for creating the appx file for the Windows Store App package.

## Building Chrome Packaged App and Windows Store App ##

In addition to supporting Internet Explorer 10+, Firefox, and Chrome, this project also has support for creating a Chrome Packaged App, and a Windows Store app.

*To install the project as an appx file on Windows:*

1. run `.\Build-AppX.ps1` from the AppX folder.
2. this will package and install the appx file to your start menu

*To create the folder for the Chrome Packaged App:*

1. run `.\Build-ChromeApp.ps1` from the ChromeApp folder of the project.
2. Open Chrome and install the package from the .\ChromeApp\dist folder

There are readme.md files in those folders with more information.

## Oddities ##

Since I did not have time to deal with [this issue](https://github.com/knockout/knockout/issues/1039) I am using the knockout-latest.debug.js rather than the properly built minified version.  A compromise that is ok for a demo, but not something you would want in production.

##Other Helpful Resources##
My talk focused on building cross-platform HTML apps using community tools.  If you want to learn more about building specifically for Windows, including taking advantage of platform specific capabilities I recommend [this series](http://aka.ms/windevbeginjs) that will walk you step by step through building a first class Windows app using HTML.

If you want to learn how to integrate your web resources with core platform capabilities, particularly using the webview control, [this is a great talk](http://channel9.msdn.com/Events/Build/2014/2-560).

If you want to check out WinJS as an open source library you can find the repo here on github.  [http://github.com/winjs](http://github.com/winjs).  Also see [the road ahead](http://channel9.msdn.com/Events/Build/2014/2-506) //BUILD talk which announced our move to open source.

It you want to learn more about the subtle but important differences between using HTML in the Browser vs. using HTML in apps, you can read [this article](http://msdn.microsoft.com/en-us/library/windows/apps/hh465380.aspx).

If you wan to learn more about the [execUnsafeLocalFunction](http://msdn.microsoft.com/en-us/library/windows/apps/hh767331.aspx) you may want to watch [my previous talk](http://channel9.msdn.com/Events/Build/BUILD2011/APP-476T) on the HTML security model in apps.

## Helping out ##

Pull requests are most welcome...there is a lot I have not yet learned about Yeoman and grunt, and I am sure there are better ways of configuring the project and scripting the builds.  If there is a better way, help me fix it.

