const butInstall = document.getElementById('buttonInstall');
// let deferredPrompt; //deferredPrompt is provided by ChatGPT as the prerred way handle the behavior commented out below

// Logic for installing the PWA
// TODO: Add an event handler to the `beforeinstallprompt` event /add button, which is in an earlier activity.
//this fires when the browser detects that the app meets the criteria for installation before it offers the user the install button
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    // deferredPrompt = event; //part of ChatGPT's solution

    installBtn.style.visibility = 'visible'; //makes install button visible; I was reading somewhere that this is not a best practice for accessibility
    textHeader.textContent = 'Click the button to install!'; //change the header from the JATE logo to the install instruction
  
    installBtn.addEventListener('click', () => {
        //this whole block was provide by ChatGPT. Why?
        // if (DeferredPrompt) {
        //     deferredPrompt.prompt();
        //     deferredPrompt.userChoice.then((choiceResult) => {
        //         if (choiceResult.outcome === 'accepted') {
        //             console.log('User accepted the install prompt.');
        //             textHeader.textContent = 'Successfully installed!';
        //         }
        //         else {
        //             console.log('User dismissed the install prompt.');
        //             textHeader.textContent = 'Installation dismissed.';
        //         }
        //         deferredPrompt = null;
        //     });
        //end of ChatGPT block

      event.prompt(); //per ChatGPT and other sources on the web, this is incorrect, so why does it work?
            installBtn.setAttribute('disabled', true);
            installBtn.textContent = 'Installed!';
        // } //this is also part of the ChatGPT block
    });
}) //per the provided code by the instructor, this was here, not below the next block. Why was the source code differnt from the example in activity 19?
// TODO: Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
    event.prompt(); //again, ChatGPT would say this is wrong. What, exactly, is happending here since event doesn't have a prompt method? why is event crossed out?
    installBtn.setAttribute('disabled', true);
    installBtn.textContent = 'Installed!';
});

// TODO: Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
    textHeader.textContent = 'Successfully installed!'; //change header to indicate successful installation; this may be superseded by If block in ChatGPT code above.
    console.log('👍', 'appinstalled', event);
  }
);

//Here's what's happening.
//1. The browser detects whether or not the site can be installed as a PWA (beforeinstallprompt fires when it detects that it can, usually on page load)
//2. If true is returned, the install button is made available.
//3. If the user clicks install, the app is installed as a PWA (where is the logic for this?) and the install button is disabled.
//4. Once the PWA is installed, the text header is changed to let the user know the installation was successful.