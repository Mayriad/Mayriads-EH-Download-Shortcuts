# Mayriad's EH Download Shortcuts

A userscript for e-hentai galleries that automates the standard download process and lets you download galleries en masse directly from gallery lists via the three official methods, which include the doggie bag archiver, H@H downloader, and ehtracker torrents.

## Table of contents

- [TLDR](#tldr)
- [About](#about)
- [Precautions](#precautions)
- [Features](#features)
- [Settings](#settings)
- [Troubleshooting](#troubleshooting)
- [Issues](#issues)
- [Credits](#credits)

## TLDR

This readme or user manual has 3000+ words, so I think I should put this here:

Please use machine translation if you need / 必要に応じて機械翻訳を使ってください / 如果需要，请使用机器翻译 / 필요한 경우 기계 번역을 사용하십시오.

This script lets you download archives, torrents en masse directly from e-hentai gallery lists via official methods. It can also use the H@H downloader if you qualify.

This script may be the fastest option for mass downloads, but you will need GP or credits to download archives since it is not an image crawler.

This is an premature extract from my private master script and I am not a programmer, so it is not widely tested yet and there may be limited support. I was not even planning to release this.

There are settings in the code and their names are obvious enough to you to use and change. The behaviour of this script is also affected by your EH home settings.

You need to [enable mixed contents](#mixed-content) to download archives. Read [the troubleshooting section](#troubleshooting) if you have problems, or make a post in [the official release thread](https://forums.e-hentai.org/index.php?showtopic=229481).

[⇧ Back to table of contents](#table-of-contents)

## About

This userscript is an extract from my private master script and only contains the download function and another function to prevent PEBKAC accidents. It adds shortcut buttons to let you download archives, torrents en masse directly from gallery lists on e-hentai.org via official methods. It can also use the H@H downloader if you qualify. It works on all gallery list pages on, which includes the search page and the favourites page. All gallery list display modes are supported.

This is not a crawler and uses official methods that are not free except for the ehtracker torrents. You will need to have enough GP or credits to download archives, and you will only be entitled to use the H@H downloader if you are running a H@H client. The upside is that this may be the fastest option for mass downloads, and it is unlikely that you will get banned for using this script, unless you overuse the batch download feature. This script is also safer in that you do not need to submit your username and password to any application. I have confidence in the readability of my code, so you are welcome to check the code if you are unnecessarily worried.

I was not planning to release this particular script, because I am nowhere close to a real programmer and a public project will be difficult for me to maintain. I thought at most I would release the whole master script sometime in the future when I have prepared everything, but then the crisis happened and I thought this would help, so I made a premature emergency release on the EH forums. Unfortunately the forum's autocorrect silently made unexpected edits to the code there, and basically wrecked it even though the edits were tiny. Furthermore, the emergency release had unusual edits made to disable all error messages to speed it up during the countdown, which may have confused some users.

[⇧ Back to table of contents](#table-of-contents)

## Precautions

### Mixed content

You need to enable mixed content in browser settings to download doggie bag archives, which is available for all galleries and all registered members. It is irrelevant only if you have set the script to only download torrents and/or use the H@H downloader. This part will be updated in the future I do more tests or get more helpful reports.

For Chrome:

When the script downloads an archive, you will see a shield icon next to the bookmark star at the right end of the omnibox. Click it and it will show a notification titled "insecure content blocked". It should have a link that says "load unsafe scripts", and you need to click this link. After you clicked it, the page will reload and then mixed content will be enabled. Note that this only applies to the tab and the domain where you did the above, so other tabs are not affected by this settings. I think once you enable it, the tab will keep this status before you change the domain by leaving EH, so you can just reuse one tab for all archive downloads.

For other browsers:

I have not tested them yet, but you can search online for solutions. The EH wiki article on technical problems also has relevant information, because images are served from H@H servers via HTTP. It is the "images are not loading" part [here](https://ehwiki.org/wiki/Technical_Issues#E-Hentai_Galleries). Please let me know if you have a working solution.

### Download records

When the script successfully starts a actual download or found a gallery with a lasting problem, the singular download buttons will say ["done" or "failed"](#singular-download). This lets you keep track of the galleries you have downloaded, but only temporarily before you move to another page or refresh the page. Therefore, you should not leave or refresh a gallery list page before you have downloaded every gallery you need on a page. Because it is possible for you to accidentally click a gallery link and leave the page, I have imported another function from my master script that makes all galleries open in new tabs.

If mixed content cannot be globally enabled for all page loads forever, you will need to manually enable it for each tab e.g., Chrome. In this case, the page may refresh after it is enabled and that will reset the download buttons and your temporary download records. Therefore, if you are downloading both archives and torrents, you should enable mixed content and trigger this page refresh first, by triggering an archive download on a gallery without torrent, before you actually start your organised download process.

### Script compatibility

I cannot really confirm where it will work and where not yet. Because it is from my private master script and I was the only user, it has not been tested for compatibility until I put it up in an emergency release thread a few days ago. I can only recommend you to use the latest browsers and load it with Greasemonkey or Tampermonkey. It has been confirmed to work with other userscript loaders, but you will need Greasemonkey or Tampermonkey for my master script later when I release it to replace this script.

While it should work in modern browsers, how they treat HTTPS-HTTP mixed content makes a critical difference, and you need to follow the right steps to [enable it yourself](#mixed-content). It is at least very easy for me in Chrome and only requires two clicks. Making this script immune to it will at least require me to rewrite a large proportion of this script, and I may not even be good enough to do it. Therefore, I cannot do rewrite it anytime soon and you will have to enable it or rewrite the code yourself.

### Project limitations

For the private-script, not-a-programmer reasons mentioned above, this script is not widely tested yet and there may be limited support. I will try to help, which is a statement you can believe after I have manned the help desk subforum for two or three years, but I may not be good enough at it and also may not respond to feature requests, which will become a greater problem once I release the broader master script. If you have problems, I would encourage you to search on the internet and perhaps the EH forum for solutions if applicable. My code should be quite readable, so you can explore the code as well.

If you need help or would like to say something, I recommend you to make a post in [the official release thread](https://forums.e-hentai.org/index.php?showtopic=229481) on the EH forum if you have an EH account, since I am not a real programmer and do not really use GitHub. Plus, there are other experienced people on the forum who can respond to your questions, since the performance of this script depends on the site.

[⇧ Back to table of contents](#table-of-contents)

## Features

### Singular download

A singular download button will be placed on top of the category button for each gallery on a gallery list page. Before such a button is activated, it will only show when you hover your mouse pointer over a gallery on the list, so that it will not stop you from checking the category information. At this stage, the button is blue and says "download".

Clicking a singular download button will start an invisible, automated process that attempts to download the gallery via one of the three official methods, which will depend on [the settings](#settings) you use. After the button activated, it can change into the following states and the button will stay visible:

**"Loading"**

When the download process is running, the button will return yellow and say "loading", because it literally loading the relevant windows in the download process. The download process will automatically retry in certain conditions, so you may see a button staying in this loading state for a while. If you have not enabled mixed content, the button will stay in this state forever when it is trying to download the archive before you refresh or change the page, so make sure you [enable that](#mixed-content).

**"Done"**

When a download succeeds, the button will turn black and say "done", and a download start soon. However, this actual download might still fail if your internet connection is unstable, which is beyond what this script can control.

**"Unavailable"**

When a download fails because the server, the archiver, or the torrent is temporarily unavailable, it will turn red and say "unavailable". You can click this button to retry after waiting for a while.

**"Failed"**

When it fails for other more lasting problems, it will also turn red but say "failed"; an error message will be provided in a popup, unless you disable them in [the settings](#`hide_error_messages`). You are allowed to click "failed" buttons, but these problems can last a few days, so this is not recommended.

### Batch download

A batch download button will be placed next to the gallery list display mode selector in the relatively empty top-right area of a gallery list page. It should say "download 3 galleries" by default, which means it will download three galleries at time, and [this number can be reconfigured](#`batch_download_number`).

Clicking this button will automatically activate the next three singular download buttons on the current gallery list page from left to right (for the thumbnail gallery list display mode) and then from top to bottom. The buttons in ["done" and "failed" states](#singular-download) will be skipped for reasons described above; this button is not affected gaps created by these two states in a gallery list, so all three available galleries in the formation below will be downloaded:

> [Download] [Done] [Download] [Failed] [Download]

When there are less than three galleries to be downloaded on a page, the button will still say "download 3 galleries", but it will accordingly attempt to download less than three galleries, so do not worry about errors.

This button is very convenient and you can just keep pressing this button to download all galleries on a page. When there are no more galleries to download, because they have all been downloaded or failed, this button will change to say "no more galleries". Then there is nothing more to do on this page, and you can go to another page if you do not need to save this page to remember which galleries failed.

It is recommended to check your downloaded files to see whether they really match the galleries you downloaded. In addition, you should know that the website has a page load limit, so you should not overuse this button or [its setting](#`batch_download_number`), unless you want to get temporarily banned. [Since there is no hurry now](https://ehwiki.org/wiki/Site_Retirement), you do not need to rush.

### Torrent download

Torrent download is enabled by default in [the settings](#`enable_torrent_download`). When this is enabled, the script will try to download torrents first. The selection procedure will firstly filter out the torrents that are not up-to-date compared to the corresponding gallery, then the torrents that does not have enough seeds to meet [the set threshold](#`minimum_number_of_seeds`). If there are torrents that pass these two checks, the torrent that contain the biggest files will be downloaded.

If there is no suitable torrent or just no torrent at all, the script will automatically resort to archive download and silently try again. If you have disabled the archive download, then galleries that do not have torrents will not get the singular download buttons in the first place, and the selection process mentioned above will not happen for galleries that do have torrents. In other words, when archive download is disabled, the script can only download galleries that have torrents and will definitely download a torrent for each of these galleries.

Lastly, please note that the redistributable torrent will be served by the site since this userscript does not carry login information. Therefore your torrent download and upload statistics will not be recorded.

### Gallery download

There is not much to say about this, except you need GP or credits for it, and you can configure the script to download the original or resample archive using [its setting](#`archive_type_to_download`).

### H@H download

This is a new feature, because previously I did not have access to it and hence could not add it. This is not enabled by default and you will need to edit [a setting](#`archive_type_to_download`) to use it and select the resample size or original version to download. Let me know if you have problems with this feature.

[⇧ Back to table of contents](#table-of-contents)

## Settings

You can find the settings for this script at the beginning of the code. I think you would not need to change these once you have figured out what is optimal for you. You can find detailed explanations relating to these settings in [the features section](#features) above.

### `ENABLE_TORRENT_DOWNLOAD`

This decides whether the userscript will try to download torrents instead of archives. The default value is `true`.

### `MINIMUM_NUMBER_OF_SEEDS`

This is is the minimum number of seeds a torrent must have in order to be considered viable in the torrent selection procedure. This threshold helps to ensure that downloaded torrents will have enough seeds to eventually finish, but it is ignored when you have disabled archive download using the next setting below. The default value is `3` and you can set it to `0` to disable this seed requirement.

### `ENABLE_ARCHIVE_DOWNLOAD`

This decides whether the script will try to download archives at all. You can disable it for a pure torrent download mode. The default value is `true`.

### `ARCHIVE_TYPE_TO_DOWNLOAD`

This is the type of archive to be downloaded. Please note that this includes the options for the H@H downloader as well, because it also uses the same "archive download" popup on EH. This is the only place throughout this document where the word "archive" includes H@H downloads, so do not worry.

This setting is only effective if the archiver setting in your EH home settings is on "manual select"; otherwise this setting in the code will be overridden by your "auto select original/resample" archiver setting in your EH home settings.

The default value is `'Download Original Archive'` and there are a number of values you can use:

- `'Download Original Archive'`
- `'Download Resample Archive',`
- `'H@H 780x'`
- `'H@H 980x'`
- `'H@H 1280x'`
- `'H@H 1600x'`
- `'H@H 2400x'`
- `'H@H Original'`

Note that the value for this option needs quotation marks, and you can only use the six H@H options above if you are running a H@H client.

### `BATCH_DOWNLOAD_NUMBER`

This is the number of galleries that will be downloaded at once when you click the batch download button. Greatly increasing this batch size is similar to spamming the batch download button, so it may get you banned for excessive page loads. The default value is `3` and you should not increase it too much.

### `HIDE_THUMBNAIL_UPON_DOWNLOAD`

This controls whether the thumbnail in extended and thumbnail display mode will be hidden after a download has successfully started i.e., when the button changes to "done". The default value is `true` because I think it makes the progress more visible.

### `HIDE_ERROR_MESSAGES`

This will hide all error alerts given by this script when a download fails for a relatively unusual reason. Temporary problems that leave singular download buttons in "unavailable" state do not give error alerts. The default value is `false` and I do not think you need to change it.

[⇧ Back to table of contents](#table-of-contents)

## Troubleshooting

### Persistent "loading" state

If your singular download buttons are stuck in the "loading" state when you are downloading archives without ever changing to another state, the most likely cause is mixed content being blocked by your browser. You can confirm that this is indeed the cause if:

- You can download the archive manually.

- In Chrome, you see a shield icon next to the bookmark star at the right end of the omnibox.

- Your browser says something about blocking mixed content. For example, Chrome would say:

	```
	Mixed Content: The page at '*' was loaded over HTTPS, but requested an insecure resource '*'. This request has been blocked; the content must be served over HTTPS.
	```

The earlier precautions section provides a quick solution for Chrome. I will try to update that section to include solutions for other browsers, but it would be great if you can solve it yourself and let me know how you did it, so that I can quickly a solution here to help others.

The second possible explanation is that you are just having a hard time trying to connect to the archivers, because a lot of people are still downloading. If you cannot manually download the archive by going to the gallery page, then this is the reason.

The third possible reason is blockage by other scripts, extensions, or software. You can disable everything besides this script and the loader extension, perhaps by using incognito mode, and see if this script works.

### No actual download after reaching "done" state

Actual download might fail if your internet connection is unstable, which is beyond what this script can control. If you think this is not the cause, let me know and I might have a look.

[⇧ Back to table of contents](#table-of-contents)

## Issues

I am wondering whether there can be missed or duplicate downloads when you use this userscript, especially when you download a lot of galleries at roughly the same time. I have been using it for a long time and I have not had this problem, so I am no idea if it will actually happen. This does not include failed downloads due to bad connection or other external factors.

Then, there are two things I need help with: if you can tell me how you enabled mixed content in your browser, that would help a lot. Also, the code cannot handle the error the site throws when you have insufficient funds for an archive download, because I will not be able to see it. Therefore, please let me know how the popup looks and what it says.

[⇧ Back to table of contents](#table-of-contents)

## Credits

- Tenboro, EH staff members and contributors (which would include myself), for running the website for so many years.
- EH member hzqr, for his old gallery downloader userscript, which somewhat influenced the download function in my master script.
- EH member Spdu, for supplying reference material for the H@H downloader feature and later testing it, because I do not have access to this downloader myself.

[⇧ Back to table of contents](#table-of-contents)
