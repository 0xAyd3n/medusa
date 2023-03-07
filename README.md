<img src="https://raw.githubusercontent.com/Ch0pin/medusa/master/libraries/logo.svg" width ="1835" height="508">

# **Description**:

**MEDUSA** is an Extensible and Modularized framework that automates processes and techniques practiced during the **dynamic analysis** **of Android Applications**.  

> A detailed guide about the project is moving to our [wiki page](https://github.com/Ch0pin/medusa/wiki), so until we fully move there we are going to be a bit messy. 

# **Installation**

```
$ pip install -r requirements.txt
```

**Requirements:** 

- Linux or macOS (currently medusa doesn't support windows)
- Python 3 (use the latest python release instead of the one shiped with MacOS to avoid issues with using libedit instead of GNU's readline)
- Rooted device 
- adb
- FRIDA server (running on the mobile device)

Demo videos on how Medusa works can be found in the links below:

- [MEDUSA | Android Penetration tool](https://www.youtube.com/watch?v=4hpjRuNJNDw) (credits [@ByteTheories](https://www.youtube.com/@ByteTheories))
- [MEDUSA | Android Malware Analysis 101](https://www.youtube.com/watch?v=kUqucdkVtSU) (credits [@ByteTheories](https://www.youtube.com/@ByteTheories))
- [Unpacking Android malware with Medusa](https://www.youtube.com/watch?v=D2-jREzCE9k) (credits [@cryptax](https://twitter.com/cryptax))
- [Unpacking Android APKs with Medusa](https://www.youtube.com/watch?v=ffM5R2Wfl0A) (credits [@LaurieWired](https://twitter.com/LaurieWired))
- [#Medusa - Extensible binary instrumentation framework based on #FRIDA for Android applications](https://www.youtube.com/watch?v=Hon7zETJawA) (credits [@AndroidAppSec](https://www.youtube.com/@AndroidAppSec))

Medusa consists of two main scripts: **medusa.py** and **mango.py**:

# **Using medusa.py**

The main idea behind MEDUSA is to be able to add or remove hooks for Java or Native methods in a large scale while keeping the process simple and effective. MEDUSA has **more than** **90** modules which can be combined, each one of them dedicated to a set of tasks. Indicatively, some of these tasks include:

-  SSL pinning bypass
-  UI restriction bypass (e.g. Flag secure, button enable)
-  Class enumeration
-  Monitoring of:
   -  Encryption process (keys, IVs, data to be encrypted)
   -  Intents
   -  Http communications
   -  Websockets
   -  Webview events
   -  File operations
   -  Database interactions
   -  Bluetooth operations
   -  Clipboard
-  Monitoring of API calls used by malware applications, such as:
   -  Spyware
   -  Click Fraud
   -  Toll Fraud
   -  Sms Fraud
   
Furthermore you can intercept Java or Native methods that belong to 3rd party apps or create complex frida modules with just few simple commands. 

Please reffer to our [detailed wiki](https://github.com/Ch0pin/medusa/wiki) for usage details. 

# **Using mango.py**

Mango is medusa's twin brother. It's main functionalities include:

- Parse an application's Android Manifest
- Create your local application research database
- Automate boring processes like: set the debuggable flag of an app, set up a MITM, indicate the application's attack surface (exported activities, deeplinks, services etc.) and many many more ...

A [detailed WIKI](https://github.com/Ch0pin/medusa/wiki) is currently under construction.

# **Updates**:

### (12/2022) Using the translator script:
1. Replace the default google_trans_new.py of you google_trans_new python package with the one from the utils/google_trans_new.py
2. Import it with medusa>use helpers/tranlsator


# **Contribute**:

- By making a pull request
- By creating a medusa module (see [how to](https://github.com/Ch0pin/medusa/wiki/Medusa#creating-a-medusa-module))
- By reporting an error/issue 
- By suggesting an improvement
- By buying a treat:

**Bitcoin (BTC) Address**: bc1qhun6a7chkav6mn8fqz3924mr8m3v0wq4r7jchz

**Ethereum (ETH) Address**: 0x0951D1DD2C9F57a9401BfE7D972D0D5A65e71dA4


# Screenshots

#### - SSL Unpinning

![Screenshot 2020-09-22 at 16 41 10](https://user-images.githubusercontent.com/4659186/151658672-dc80f37c-f4fb-48b8-a355-1dc0bf2b172c.png)

#### - Intent Monitoring 

<img src="https://user-images.githubusercontent.com/4659186/151658670-2ddac205-4c77-418a-8edd-2035b233387e.png" alt="Screenshot 2020-09-22 at 16 41 10" style="zoom:100%;" />

#### - Passive Monitoring of HTTP Requests

![Screenshot 2020-09-22 at 16 41 10](https://user-images.githubusercontent.com/4659186/93905749-34203580-fcf3-11ea-9f36-8138141c2302.png)

![Screenshot 2020-09-22 at 16 43 37](https://user-images.githubusercontent.com/4659186/93905699-25d21980-fcf3-11ea-85e0-fafd62ea7d28.png)



#### - Native Libraries Enumeration

![Screenshot 2020-09-22 at 16 41 10](https://user-images.githubusercontent.com/4659186/151658663-6c77f2e3-6f42-4424-b593-d8cfe3d3bed3.png)



#### - Memory READ/WRITE/SEARCH (interactive mode):

![Screenshot 2020-09-22 at 16 41 10](https://user-images.githubusercontent.com/4659186/151658659-b4f83296-60ec-4818-a303-5645284b0a67.png)

#### - Personal information exfiltration monitoring

> Hooks api calls which found to be common for this kind of malware, including:
>
> - Contact exfiltration 
> - Call log exfiltration
> - Camera usage
> - Microphone usage
> - Location tracking
> - File uploading
> - Media recording
> - Clipboard tracking
> - Device recon
> - Screenshot capture

<img src="https://user-images.githubusercontent.com/4659186/87245281-1c4b4c00-c43c-11ea-9cad-195ceb42794a.png" width="450" height="460">

#### - Translation 

> Translates the application's UI by hooking 'setText' calls  

<img src="https://user-images.githubusercontent.com/4659186/86785673-e59bbd00-c05a-11ea-8fb0-9c3f86043104.png" width="250" height="450">                             <img src="https://user-images.githubusercontent.com/4659186/86785688-e9c7da80-c05a-11ea-838f-e4c7568c7c2a.png" width="250" height="450">     


<img src="https://user-images.githubusercontent.com/4659186/86785693-eb919e00-c05a-11ea-901e-8cc180d6274a.png" width="550" height="250">


**CREDITS**:

- Special Credits to [@rscloura](https://github.com/rscloura) for his contributions
- Logo Credits: https://www.linkedin.com/in/rafael-c-ferreira
- https://github.com/frida/frida
- https://github.com/dpnishant/appmon
- https://github.com/brompwnie/uitkyk
- https://github.com/hluwa/FRIDA-DEXDump.git
- https://github.com/shivsahni/APKEnum
- https://github.com/0xdea/frida-scripts
- https://github.com/Areizen/JNI-Frida-Hook

