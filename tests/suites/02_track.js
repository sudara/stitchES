module.exports = {
  afterEach: (browser, done) => {
    // eslint-disable-next-line global-require
    require("../../nightwatch-browserstack").updateStatusIfBrowserstack(browser, done)
  },

  "The whilePlaying callback gets called" : browser => {
    browser.url(browser.launchUrl)
      .waitForElementPresent("body")
      .click("#playlist2-track1 svg")
      .assert.playing()
      .assert.containsText("#debug", "FIRED: whilePlaying Callback")
    },

  "The onError callback gets called" : browser => {
    browser .url(browser.launchUrl)
      .waitForElementPresent("body")
      .click("#track404 svg")
      .assert.not.playing()
      .assert.containsText("#debug", "FIRED: onError Callback")
  },

  "<progress> element updates during playback" : browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementPresent("body")
      .click("#track1 svg")
      .assert.progressBarMoved("#track1progress")
  },

  "Custom defined progress elements update their width": browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementPresent("body")
      .click("#playlist2-track1 svg")
      .assert.progressBarMoved("#customProgress")
  },

  "The time updates at the start of playback" : browser => {
    browser
      .url(browser.launchUrl)
      .click("#track1 svg")
      .assert.timeUpdated("#track1time", "0:00")
  },

  "The time updates during playback": browser => {
    browser
      .url(browser.launchUrl)
      .click("#track1 svg")
      .assert.timeUpdated("#track1time", "0:01")
  },

  "Seeking works and doesn't reload track": browser => {
    browser
      .url(browser.launchUrl)
      .waitForElementPresent("body")
      .click("#track1 svg") // play

       // wait long enough for next track to start loading
       // important because it fires src:changed
       // which we are looking for later
      .pause(500)
      .click("#track1 svg") // pause
      .cleanDebug()
      .click("#track1progress") // seek
      .assert.containsText('#debug', 'audioNode:seek')
      .pause(50)
      .assert.not.containsText('#debug', 'audioNode:srcchanged')
      .assert.not.containsText('#debug', 'audioNode:whileLoading')
      .click("#track1 svg") // pause
      .assert.playing(2.0) // assumes test tracks are more than 4 seconds long
  }

}
