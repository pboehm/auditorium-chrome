// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var TOKEN = localStorage['token'];
var HOST  = localStorage['host'] || "auditorium.pboehm.org";
var PROTOCOL = localStorage['protocol'] || "http";

var auditorium = {

  setBadgeText: function(text) {
    chrome.browserAction.setBadgeText({text: text});
  },

  auditoriumUrl: function() {
    return PROTOCOL + "://" + HOST + "/remote/" + TOKEN;
  },

  /**
   * Sends an XHR GET request to grab information about new comments/posts
   *
   */
  getChanges: function() {
    var self = this;

    // check if the token is configured
    if (TOKEN === undefined) {
      self.setBadgeText('TOKEN')
      return;
    }

    $.getJSON(this.auditoriumUrl(), function(data) {
      self.processResult(data);
    }).error(function() {
      self.setBadgeText("ERR")
    });
  },

  /**
   * process the result and set the badge depending on result
   */
  processResult: function (res) {
    console.log(res);

    var new_comments = 0;
    var new_posts = 0;

    for(var val in res) {
      var post = res[val];
      new_comments += post.new_comments;

      if (post.is_new_post) {
        new_posts++;
      }
    }

    var summary = new_posts + "/" + new_comments;
    if (summary === "0/0") {
      summary = "";
    }

    this.setBadgeText(summary);
  },

};

/**
 * add a listener that opens a new tab on icon click
 */
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': "http://" + HOST}, function(tab) {});
  auditorium_check.setBadgeText("")
});

/**
 * Create the alarm which is fired every X minutes and handle these events
 */
chrome.alarms.create("auditorium_check", { periodInMinutes: 1 });
auditorium.getChanges();

chrome.alarms.onAlarm.addListener(function(alarm) {
  auditorium.getChanges();
  console.log(alarm);
});
