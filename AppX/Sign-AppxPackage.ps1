Param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$publisher,
    [Parameter(Mandatory=$true, Position=1)]
    [string]$keyName
);

$env:Path += ";" + (Join-Path ${Env:ProgramFiles(x86)} "Windows Kits\8.1\bin\x64\");

Set-Location C:\code\clickgame\appx\;

# Create self signed root certificate with the issuer equal to the one defined in the appxmanifest.xml file:
makecert -n "$publisher" -r -h 0 -eku "1.3.6.1.5.5.7.3.3,1.3.6.1.4.1.311.10.3.13" -m 6 -sv "$keyName.pvk" "$keyName.cer";

certutil -addStore TrustedPeople "$keyName.cer" -f;

# Convert the pvk certificate file into a pfx file
pvk2pfx /pvk "$keyName.pvk" /spc "$keyName.cer" /pfx "$keyName.pfx";
