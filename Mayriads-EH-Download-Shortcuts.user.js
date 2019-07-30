// ==UserScript==
// @name            Mayriad's EH Download Shortcuts
// @namespace       https://github.com/Mayriad
// @version         1.5.3
// @author          Mayriad
// @description     Adds buttons to download galleries directly from the gallery list
// @updateURL       https://github.com/Mayriad/Mayriads-EH-Download-Shortcuts/raw/master/Mayriads-EH-Download-Shortcuts.user.js
// @downloadURL     https://github.com/Mayriad/Mayriads-EH-Download-Shortcuts/raw/master/Mayriads-EH-Download-Shortcuts.user.js
// @include         https://e-hentai.org/*
// @include         https://ehtracker.org/*
// @include         htt*://*/*downloadshortcuts=*
// @run-at          document-start
// ==/UserScript==

/**
 *  GitHub repository:  https://github.com/Mayriad/Mayriads-EH-Download-Shortcuts
 *  User manual:        https://github.com/Mayriad/Mayriads-EH-Download-Shortcuts/blob/master/README.md
 *  Forum thread:       https://forums.e-hentai.org/index.php?showtopic=229481
 *
 *  Please note that the settings below will be reset after an update, so you will need to edit them again if they have
 *  been edited. This script will not need a lot of updates in the future, so hopefully the annoyance can be minimised.
 */

// Settings that you can change after reading the readme on GitHub -----------------------------------------------------

const ENABLE_TORRENT_DOWNLOAD = true;

const MINIMUM_NUMBER_OF_SEEDS = 3;

const ENABLE_ARCHIVE_DOWNLOAD = true;

const ARCHIVE_TYPE_TO_DOWNLOAD = 'Download Original Archive';

const BATCH_DOWNLOAD_NUMBER = 3;

const HIDE_THUMBNAIL_UPON_DOWNLOAD = true;

const HIDE_ERROR_NOTIFICATIONS = false;

// Code that you should not change unless you know what you are doing --------------------------------------------------

// Runs the list of top-level functions below when the DOM is ready.
let onDomLoad = function() {
    addDownloadShortcuts();
    openGalleriesSeparately();
};

// Adds buttons to download archives and torrents directly from gallery lists and automates the download process.
let addDownloadShortcuts = function() {
    // Appends a query string that carries the information from this function to a URL.
    let appendQueryString = function(url, nonce, timestamp) {
        return url + (url.includes('?') ? '&' : '?') + 'downloadshortcuts=' + nonce + (timestamp !== undefined ?
            '&timestamp=' + timestamp : '');
    }

    // This half applies to gallery list pages as their url's will not contain the query string.
    if (!window.location.href.includes('downloadshortcuts=')) {
        let displayMode = document.body.querySelector('#dms option[selected = "selected"]');
        if (displayMode === null) {
            // Do not run this function if not on a gallery list.
            return;
        } else {
            displayMode = displayMode.textContent;
        }

        // Adds CSS styles to support the download buttons.
        let addCustomStyles = function() {
            let downloadButtonStyles = document.createElement('style');
            downloadButtonStyles.type = 'text/css';
            downloadButtonStyles.id = 'downloadButtonStyles';
            downloadButtonStyles.textContent = `
                .downloadButton { position: absolute; top: 0px; left: 0px; box-shadow: none; z-index: 1;
                    transition: all 0.2s; margin: -1px; }
                .downloadButton.idle { background-color: rgba(34, 167, 240, 1); cursor: pointer; opacity: 0;
                    border: 1px solid rgba(0, 127, 200, 1); }
                .downloadButton.loading { background-color: rgba(247, 202, 24, 1); cursor: default;
                    border: 1px solid rgba(207, 162, 0, 1); }
                .downloadButton.done { background-color: rgba(0, 0, 0, 1); cursor: default;
                    border: 1px solid rgba(0, 0, 0, 1); }
                .downloadButton.failed, .downloadButton.unavailable { background-color: rgba(255, 0, 0, 1);
                    cursor: pointer; border: 1px solid rgba(215, 0, 0, 1); }
                .downloadButton.idle:hover { box-shadow: 0px 1px 7px 2px rgba(34, 167, 240, 0.6); }
                .hiddenIframe { position: absolute; bottom: -100vh; visibility: hidden; }`;

            // Set the button size each display mode.
            switch (displayMode) {
                case 'Minimal':
                case 'Minimal+':
                    downloadButtonStyles.textContent += `
                        tr:hover .downloadButton { display: inline-block; opacity: 1; }
                        .cs:not([data-disabled]):hover { opacity: 1 }`;
                    break;
                case 'Compact':
                    downloadButtonStyles.textContent += `
                        tr:hover .downloadButton { display: inline-block; opacity: 1; }
                        .cn:not([data-disabled]):hover { opacity: 1 }`;
                    break;
                case 'Extended':
                    downloadButtonStyles.textContent += `
                        .downloadButton { width: 110px; }
                        tr:hover .downloadButton { display: inline-block; opacity: 1; }
                        .cn:not([data-disabled]):hover { opacity: 1 }`;
                    break;
                case 'Thumbnail':
                    downloadButtonStyles.textContent += `
                        .downloadButton { width: 110px; height: 18px; line-height: 18px; }
                        .gl1t:hover .downloadButton { display: inline-block; opacity: 1; }
                        .cs:not([data-disabled]):hover { opacity: 1 }`;
            }
            document.head.appendChild(downloadButtonStyles);

            let sharedDmsStyles = document.getElementById('sharedDmsStyles');
            if (sharedDmsStyles !== null) {
                sharedDmsStyles.textContent += `
                    #batchButton { left: -165px; }`;
            } else {
                sharedDmsStyles = document.createElement('style');
                sharedDmsStyles.type = 'text/css';
                sharedDmsStyles.id = 'sharedDmsStyles';
                sharedDmsStyles.textContent = `
                    #dms > div > input { position: absolute; top: -13px; width: 160px; min-height: 24.5px;
                        height: 24.5px; margin: 3px 1px 0px; line-height: 17px; font-weight: bold; font-size: 10pt;
                        padding: 0px; border-width: 1px; }
                    #dms > div > select { height: 24.5px; }
                    #batchButton { left: -165px; }`;
                document.head.appendChild(sharedDmsStyles);
            }
        };

        // Adds the singular download buttons to gallery list.
        let addDownloadButtons = function() {
            let bases;
            let galleries;
            let thumbnails;
            switch (displayMode) {
                case 'Minimal':
                case 'Minimal+':
                    bases = document.body.querySelectorAll('.gl1m.glcat > .cs');
                    galleries = document.body.querySelectorAll('.gl3m.glname > a');
                    break;
                case 'Compact':
                    bases = document.body.querySelectorAll('.gl1c.glcat > .cn');
                    galleries = document.body.querySelectorAll('.gl3c.glname > a');
                    break;
                case 'Extended':
                    bases = document.body.querySelectorAll('.gl3e > .cn');
                    galleries = document.body.querySelectorAll('.gl2e > div > a');
                    thumbnails = document.body.querySelectorAll('.gl1e > div > a');
                    break;
                case 'Thumbnail':
                    bases = document.body.querySelectorAll('.gl5t > div > .cs');
                    galleries = document.body.querySelectorAll('.gl3t > a');
                    thumbnails = document.body.querySelectorAll('.gl3t > a');
            }
            let torrents = document.body.querySelectorAll('.gldown');
            let timestamps = document.body.querySelectorAll('div[id ^= "posted_"]');

            let i = bases.length;
            while (i--) {
                let downloadButton = document.createElement('div');
                if (displayMode === 'Compact' || displayMode === 'Extended') {
                    downloadButton.className = 'cn downloadButton idle';
                } else {
                    downloadButton.className = 'cs downloadButton idle';
                }
                downloadButton.textContent = 'Download';
                downloadButton.setAttribute('data-gallery', galleries[i].href);
                if (thumbnails !== undefined) {
                    downloadButton.dataThumbnail = thumbnails[i];
                }

                // If there is indeed a torrent, the child will be "a"; otherwise it will be "img".
                if (torrents[i].firstChild.nodeName.toLowerCase() === 'a' && ENABLE_TORRENT_DOWNLOAD) {
                    downloadButton.setAttribute('data-torrent', torrents[i].firstChild.href);
                } else {
                    if (ENABLE_ARCHIVE_DOWNLOAD) {
                        downloadButton.setAttribute('data-torrent', 'none');
                    } else {
                        // A button will not be added if torrent and archive are both not possible.
                        continue;
                    }
                }
                downloadButton.setAttribute('data-timestamp', Date.parse(timestamps[i].textContent));
                downloadButton.addEventListener('click', attemptGalleryDownload);
                bases[i].removeAttribute('onClick');
                bases[i].style.position = 'relative';
                bases[i].appendChild(downloadButton);
            };
        };

        // Adds a button next to the gallery list display mode selector to download multiple galleries at once.
        let addBatchButton = function() {
            let batchButton = document.createElement('input');
            batchButton.type = 'button';
            batchButton.id = 'batchButton';
            batchButton.value = 'Download ' + BATCH_DOWNLOAD_NUMBER + ' Galleries';
            batchButton.title = 'Automatically download the next ' + BATCH_DOWNLOAD_NUMBER + ' available galleries ' +
                'on current page.';
            batchButton.addEventListener('click', function attemptBatchDownload() {
                let idleButtons = document.body.querySelectorAll('.downloadButton.idle, .downloadButton.unavailable');
                if (idleButtons.length !== 0) {
                    for (let i = 0; i < Math.min(BATCH_DOWNLOAD_NUMBER, idleButtons.length); ++i) {
                        idleButtons[i].click();
                    }
                } else {
                    // Do not declare page completion when there are ongoing tasks, since these may end up in the
                    // "unavailable" state.
                    if (document.body.querySelectorAll('.downloadButton.loading').length === 0) {
                        batchButton.value = 'No More Galleries';
                    }
                }
            });
            let batchDiv = document.createElement('div');
            batchDiv.appendChild(batchButton);
            document.getElementById('dms').appendChild(batchDiv);
        }

        let runningAttempts = {};

        // Starts an automated download process when a download button is clicked.
        let attemptGalleryDownload = function(ev) {
            let downloadButton = ev.target;
            if (/loading|done/.test(downloadButton.className)) {
                // Do nothing if the download is already loading or completed.
                return;
            }
            downloadButton.className = downloadButton.className.replace(/idle|unavailable/, 'loading');
            downloadButton.textContent = 'Loading';

            let nonce = Math.floor(Math.random() * (1 << 30));
            let iframe = document.createElement('iframe');
            runningAttempts[nonce] = {
                downloadButton: downloadButton,
                iframe: iframe,
                timeout: null
            };
            iframe.src = appendQueryString((downloadButton.getAttribute('data-torrent') !== 'none' ?
                downloadButton.getAttribute('data-torrent') : downloadButton.getAttribute('data-gallery')),
                nonce, downloadButton.getAttribute('data-timestamp'));
            // A class is used because the iframe here would not work on Firefox if display: none is used.
            iframe.className = 'hiddenIframe';
            document.body.appendChild(iframe);
            scheduleDownloadTimeout(nonce);
        };

        // Schedules a timeout that cancels a download attempt if it does not succeed in 15 seconds.
        let scheduleDownloadTimeout = function(nonce) {
            clearTimeout(runningAttempts[nonce].timeout);
            runningAttempts[nonce].timeout = setTimeout(function() {
                onFailure({
                    type: 'failure',
                    nonce: nonce,
                    reason: 'timeout'
                });
            }, 15000);
        };

        // Adds an event listener for messages from the cross-origin iframes.
        let addMessageListener = function() {
            window.addEventListener('message', function(ev) {
                let message = ev.data;
                if (!runningAttempts.hasOwnProperty(message.nonce)) {
                    return;
                }
                switch (message.type) {
                    case 'download':
                        onDownload(message);
                        break;
                    case 'failure':
                        onFailure(message);
                        break;
                    case 'success':
                        onSuccess(message);
                }
            });
        };

        // Opens an iframe to attempt the actual archive or torrent download once the file address is received.
        let onDownload = function(message) {
            let attempt = runningAttempts[message.nonce];
            clearTimeout(attempt.timeout);
            document.body.removeChild(attempt.iframe);

            let iframe = document.createElement('iframe');
            iframe.src = appendQueryString(message.url, message.nonce);
            iframe.className = 'hiddenIframe';
            attempt.iframe = iframe;
            document.body.appendChild(iframe);

            // Check whether the download is successful only after 1 second, by checking whether onFailure() has
            // deleted the nonce first. The delay is needed to ensure onFailure() finishes deleting the nonce first
            // when needed. This will cause a visible delay but anything below 1 second may not be safe.
            setTimeout(function() {
                if (runningAttempts.hasOwnProperty(message.nonce)) {
                    onSuccess(message);
                }
            }, 1000);
        };

        // Terminates a download attempt and reacts appropriately once a failure message is received.
        let onFailure = function(message) {
            let attempt = runningAttempts[message.nonce];
            delete runningAttempts[message.nonce];
            clearTimeout(attempt.timeout);
            let downloadButton = attempt.downloadButton;
            document.body.removeChild(attempt.iframe);

            switch (message.reason) {
                case 'timeout':
                    // Try again when there is a timeout.
                    downloadButton.className = downloadButton.className.replace('loading', 'idle');
                    downloadButton.click();
                    break;
                case 'inadequate torrents':
                    // Change to archive download instead when the available torrents do not meet the requirments.
                    downloadButton.setAttribute('data-torrent', 'none');
                    downloadButton.className = downloadButton.className.replace('loading', 'idle');
                    downloadButton.click();
                    break;
                case 'unavailable torrent':
                case 'server problem':
                    // Allow downloads that failed due to temporarily unavailable torrent or server to be retried.
                    downloadButton.className = downloadButton.className.replace('loading', 'unavailable');
                    downloadButton.textContent = 'Unavailable';
                    break;
                default:
                    // For other reasons, do not retry, declare a failure and give a notification instead.
                    downloadButton.className = downloadButton.className.replace('loading', 'failed');
                    downloadButton.textContent = 'Failed';
                    if (!HIDE_ERROR_NOTIFICATIONS) {
                        alert(message.notification);
                    }
            }
        };

        // Cleans up after a sucessful file download.
        let onSuccess = function(message) {
            let attempt = runningAttempts[message.nonce];
            clearTimeout(attempt.timeout);
            delete runningAttempts[message.nonce];
            let downloadButton = attempt.downloadButton;

            // Wait for 15 seconds before closing the download iframe because downloads may start slowly.
            setTimeout(() => { document.body.removeChild(attempt.iframe); }, 15000);
            downloadButton.className = downloadButton.className.replace('loading', 'done');
            downloadButton.textContent = 'Done';

            // The corresponding thumbnail on gallery list can be hidden after a successful download.
            if (downloadButton.dataThumbnail !== undefined && HIDE_THUMBNAIL_UPON_DOWNLOAD) {
                downloadButton.dataThumbnail.parentNode.style.visibility = 'hidden';
            }
        };

        addCustomStyles();
        addDownloadButtons();
        addMessageListener();
        addBatchButton();

    // This half applies to the hidden iframes as they have the query string appended to their url's. It is executed
    // at every stage of the iframe. For iframes opened using download links, this section only runs when the download
    // link leads to an error page, so not when the download is successful.
    } else {
        let nonce = window.location.href.match(/downloadshortcuts=(\d+)/)[1];

        // Checks for the torrent list popup and starts to download the torrent that best meets selection criteria.
        let catchTorrentList = function() {
            if (xpathSelector('.//input[@name = "torrent_upload"]') !== null) {
                window.onbeforeunload = null;
                let torrents = Array.from(document.getElementsByTagName('table'), function(table) {
                    let torrent = table.getElementsByTagName('a')[0];
                    if (torrent !== undefined) {
                        return {
                            torrent: torrent.href,
                            timestamp: Date.parse(table.textContent.match(/Posted:\s*([0-9-]+\s*[0-9:]+)/)[1]),
                            size: +table.textContent.match(/Size:\s*([0-9.]+)\s*(?:MB|GB)/)[1],
                            seeds: +table.textContent.match(/Seeds:\s*(\d+)/)[1],
                            peers: +table.textContent.match(/Peers:\s*(\d+)/)[1]
                        };
                    }
                });

                if (ENABLE_ARCHIVE_DOWNLOAD) {
                    // Try to find the largest torrent that is up-to-date and also adequately seeded.
                    let timestamp = +window.location.href.match(/timestamp=(\d+)/)[1];
                    torrents = torrents.filter(torrent => torrent.timestamp >= timestamp)
                        .filter(torrent => torrent.seeds >= MINIMUM_NUMBER_OF_SEEDS);
                    if (torrents.length === 0) {
                        postFailure('inadequate torrents', 'The torrents are either not up-to-date compared to the ' +
                            'gallery or not adequately seeded.');
                    } else {
                        torrents = torrents.sort((a, b) => b.size - a.size);
                        postDownload(torrents[0].torrent);
                    }
                } else {
                    // Download the most seeded torrent without any checks when torrent is the only enabled option.
                    torrents = torrents.sort((a, b) => b.size - a.size);
                    postDownload(torrents[0].torrent);
                }
                return true;
            }
        };

        // Checks for a possible content warning page and skips it once.
        let catchContentWarning = function() {
            let skipWarningLink = xpathSelector('.//a[text() = "View Gallery"]');
            if (skipWarningLink !== null) {
                window.onbeforeunload = null;
                skipWarningLink.href = appendQueryString(skipWarningLink.href, nonce);
                skipWarningLink.click();
                return true;
            }
        };

        // Checks for the gallery view page and selects archive download.
        let catchGalleryPage = function() {
            let archiveDownloadButton = xpathSelector('.//a[text() = "Archive Download"]');
            if (archiveDownloadButton !== null) {
                window.onbeforeunload = null;
                let popupUrl = archiveDownloadButton.getAttribute('onclick').match(/'(.+?)'/)[1];
                window.location.replace(appendQueryString(popupUrl, nonce));
                return true;
            }
        };

        // Checks for the archive selection popup and makes the selection.
        // This popup is only shown when the archiver setting in the user's EH home settings is on "manual select".
        let catchArchiveSelection = function() {
            if (ARCHIVE_TYPE_TO_DOWNLOAD.includes('H@H')) {
                let hathTypeLink = xpathSelector('.//a[text() = "' + ARCHIVE_TYPE_TO_DOWNLOAD.match(
                    /H@H (\d+x|Original)/)[1] + '"]');
                if (hathTypeLink === null) {
                    // Always download the original version instead if the target H@H resample size is not available.
                    hathTypeLink = xpathSelector('.//a[text() = "Original"]');
                }
                if (hathTypeLink !== null) {
                    window.onbeforeunload = null;
                    if (hathTypeLink.href !== '#') {
                        hathTypeLink.href = appendQueryString(hathTypeLink.href, nonce);
                        hathTypeLink.click();
                    } else {
                        postFailure('incorrect setting', 'The H@H download failed, because you have set this ' +
                            'userscript to use the H@H downloader, but you do not qualify. Please note that you will ' +
                            'only be entitled to use this downloader if you are running a H@H client.');
                    }
                    return true;
                }
            } else {
                let archiveTypeButton = xpathSelector('.//input[@value = "' + ARCHIVE_TYPE_TO_DOWNLOAD + '"]');
                if (archiveTypeButton !== null) {
                    if (archiveTypeButton.disabled) {
                        // Always download the original version instead if the resample archive is not available.
                        archiveTypeButton = xpathSelector('.//input[@value = "Download Original Archive"]');
                    }
                    window.onbeforeunload = null;
                    archiveTypeButton.parentNode.parentNode.action = appendQueryString(
                        archiveTypeButton.parentNode.parentNode.action, nonce);
                    archiveTypeButton.click();
                    return true;
                }
            }
        };

        // Checks for the locating server popup before it quickly starts an automatic redirect to the next popup.
        let catchLocatingServer = function() {
            let redirectScript = xpathSelector('.//script[contains(text(), "function gotonext()")]');
            if (redirectScript !== null) {
                // This server url is always included in the website script and can still be found when the popup
                // does not show it.
                let serverUrl = redirectScript.textContent.match(/document\.location = "(.+?)"/)[1];

                // The setTimeout() is used to replicate the original delay specified in the website script to be safe.
                var delay = +redirectScript.textContent.match(/setTimeout\("gotonext\(\)", (\d+)\)/)[1];
                setTimeout(function() {
                    window.onbeforeunload = null;

                    // Override and disable the "auto start download" gallery setting because theorectially it may
                    // result in duplicate downloads.
                    window.location.replace(appendQueryString(serverUrl.replace('?autostart=1', ''), nonce));
                }, delay);
                return true;
            }
        };

        // Checks for the download ready popup and starts to download the archive.
        let catchDownloadReady = function() {
            if (ARCHIVE_TYPE_TO_DOWNLOAD.includes('H@H')) {
                if (document.body.textContent.includes('Downloads should start processing within a couple of ' +
                    'minutes')) {
                    window.onbeforeunload = null;
                    postSuccess();
                    return true;
                }
            } else {
                let downloadLink = xpathSelector('.//a[text() = "Click Here To Start Downloading"]');
                if (downloadLink !== null) {
                    window.onbeforeunload = null;
                    postDownload(downloadLink.href);
                    return true;
                }
            }
        };

        // Checks for possible error messages reported by the website.
        let catchErrorMessages = function() {
            // Notification messages are prepared here, but they may not be actually displayed.
            let bodyText = document.body.textContent;
            if (bodyText.includes('You have clocked too many downloaded bytes on this gallery')) {
                postFailure('unavailable archive', 'The archive download failed, because you have clocked too many ' +
                    'downloaded bytes on this gallery. You can try again after a few days or try torrent download ' +
                    'instead.');
                return true;
            } else if (bodyText.includes('The torrent file could not be found')) {
                postFailure('unavailable torrent', 'The torrent download failed, because the redistributable torrent ' +
                    'is not available at the moment. Please try again after a few hours or manually download the ' +
                    'personalized torrent instead.');
                return true;
            } else if (bodyText.includes('Expired or invalid session')) {
                postFailure('unavailable archive', 'The archive download failed, because you recently purchased this ' +
                    'archive and the expiry of that session stopped the current download. Please try again after one ' +
                    'or two days.');
                return true;
            } else if (bodyText.includes('Error 503 Backend fetch failed') ||
                bodyText.includes('Error 503 Service Unavailable')) {
                postFailure('server problem', 'The download failed, because the server was unavailable and the ' +
                    'website failed to load a page. Please wait briefly and try again.');
                return true;
            } else if (bodyText.includes('The archiver assigned to this archive is temporarily unavailable')) {
                postFailure('server problem', 'The archive download failed, because the archiver for this gallery is ' +
                    'unavailable at the moment. Please wait for a few hours and try again.');
                return true;
            }
        };

        // Selects an element in the document body by evaluating a XPath.
        let xpathSelector = function(xpath) {
            return document.evaluate(xpath, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
                null).singleNodeValue;
        }

        // Posts a message to the gallery list hosting this iframe to signal a file download and pass the file address.
        let postDownload = function(url) {
            parent.postMessage({
                type: 'download',
                nonce: nonce,
                url: url
            }, '*');
        };

        // Posts a message to the gallery list hosting this iframe to signal a failed attempt and pass the reason.
        let postFailure = function(reason, notification) {
            parent.postMessage({
                type: 'failure',
                nonce: nonce,
                reason: reason,
                notification: notification
            }, '*');
        };

        // Posts a message to the gallery list hosting this iframe to signal a successful H@H download instruction.
        let postSuccess = function() {
            parent.postMessage({
                type: 'success',
                nonce: nonce
            }, '*');
        };

        if (catchTorrentList() || catchContentWarning() || catchGalleryPage() || catchArchiveSelection() ||
            catchLocatingServer() || catchDownloadReady() || catchErrorMessages()) {
            // Check for different popups in the download process and react accordingly.
            return;
        } else {
            // The iframe reached a page that cannot be handled by this function yet.
            postFailure('unknown reason', 'The download cannot be initiated for some reason. The gallery could have ' +
                'been removed, or you are not logged in, or maybe you do not have enough funds.');
        }
    }
};

// Lets galleries open in new tabs or windows when the links on gallery lists are clicked.
// This function also helps to prevent accidental interruptions from misclicks when using addDownloadShortcuts().
let openGalleriesSeparately = function() {
    let displayMode = document.querySelector('#dms option[selected = "selected"]');
    if (displayMode === null) {
        // Do nothing if not on a gallery list.
        return;
    }
    let galleryLinks;
    switch (displayMode.textContent) {
        case 'Minimal':
        case 'Minimal+':
            galleryLinks = document.querySelectorAll('.gl3m.glname > a');
            break;
        case 'Compact':
            galleryLinks = document.querySelectorAll('.gl3c.glname > a');
            break;
        case 'Extended':
            galleryLinks = document.querySelectorAll('.gl1e > div > a, .gl2e > div > a');
            break;
        case 'Thumbnail':
            galleryLinks = document.querySelectorAll('.gl1t > a, .gl3t > a');
    }
    [].forEach.call(galleryLinks, function(galleryLink) {
        galleryLink.onclick = function(ev) {
            ev.preventDefault();
            window.open(galleryLink.href);
        };
    });
}

if (window.location.href.includes('downloadshortcuts=')) {
    // This onbeforeunload is mainly used to ensure the locating server popup will be caught before the redirect.
    window.onbeforeunload = addDownloadShortcuts;
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', addDownloadShortcuts);
    } else {
        addDownloadShortcuts();
    }
} else {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', onDomLoad);
    } else {
        onDomLoad();
    }
}
