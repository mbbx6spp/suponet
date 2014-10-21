/*jslint browser: true, sloppy: true, vars: true, white: true, maxerr: 50, indent: 2 */

(function ($) {
  var cssPrefix = null;

  if ($.browser.mozilla) { cssPrefix = "moz"; }
  else if ($.browser.webkit) { cssPrefix = "webkit"; }
  else if ($.browser.opera) { cssPrefix = "o"; }

  $.cssHooks.columnCount = {
    get: function(element, computed) {
      var browserSpecificName = "-" + cssPrefix + "-column-count";

      if (computed) {
        return $.css(element, browserSpecificName);
      } else {
        return element.style[browserSpecificName];
      }
    }
  };

  function adjustCommandReference() {
    var $commands = $("#commands ul");
    $commands.css("height", "auto");
    var $command = $commands.find("> *:first");
    var commandHeight = $command.outerHeight(true);
    var containerHeight = $commands.innerHeight();
    var factor = Math.floor(containerHeight / commandHeight);
    if ((factor * $commands.css("column-count")) < $commands.children(":visible").length) { factor++; }
    $commands.css("height", factor * commandHeight);
  }

  function filterCommandReference() {
    var $commands = $("#commands ul");
    var group = window.location.hash.substring(1);

    if (group.length === 0) {
      $commands.children().show();
      $commands.css("height", "auto");
    }
    else {
      $commands.find("li[data-group='" + group + "']").show();
      $commands.find("li[data-group!='" + group + "']").hide();
    }

    adjustCommandReference();
    var $groups = $("#commands nav a");
    $groups.removeClass("current");
    $groups.filter("[href='#" + group + "']").addClass("current");
  }

  function commandReference() {
    var $groups = $("#commands nav a");

    $groups.click(function() {
      window.location.hash = this.getAttribute("href").substring(1);
      filterCommandReference();
      return false;
    });
  }

  function autolink(text) {
    text = text.replace(/(\#[\-_\w\.]+)/, "<span class='hashtag'>$1</span>");
    text = text.replace(/(\@[\-_\w\.]+)/, "<span class='user'>$1</span>");
    return text.replace(/(https?:\/\/[\-\w\.]+:?\/[\w\/_\-\.]*(\?\S+)?)/, "<a href='$1'>$1</a>");
  }

  function massageTweet(text) {
    return autolink(text);
  }

  function initializeGithubRepos() {
    var $github = $("#buzz .github");
    if ($github.length === 0) { return; }
    var $table = $github.find("table");
    if ($table.length === 0) { $github.append("<table></table>"); $table = $github.find("table"); }

    $.getJSON("https://api.github.com/users/mbbx6spp?callback=?", function(response) {
      var user = response.data;
      $table.append(
        "<tr>" +
          "<td>Repos</td>" +
          "<td>" + user.public_repos + "</td>" +
        "</tr><tr>" +
          "<td>Gists</td>" +
          "<td>" + user.public_gists + "</td>" +
        "</tr><tr>" +
          "<td>Followers</td>" +
          "<td>" + user.followers + "</td>" +
        "</tr>"
      );
    });
  }

  function initializeTwitterFeed() {
    var $buzz = $("#buzz .twitter");

    if ($buzz.length === 0) { return; }

    var $ul = $buzz.find("ul");
    if ($ul.length === 0) { $buzz.append("<ul class='unstyled'></ul>"); $ul = $buzz.find("ul"); }
    var count = 0;
  }

  function initializeMaps() {
    var $map = document.getElementById("map");
    if (!$map) { return; }

    var MAP_CENTER = new google.maps.LatLng(25, -60);
    var MAP_OPTIONS = { zoom: 2, mapTypeId: google.maps.MapTypeId.ROADMAP, center: MAP_CENTER };

    var gMap = new google.maps.Map($map, MAP_OPTIONS);

    function createMapMarker(mapElement, position) {
      new google.maps.Marker({
        map: mapElement,
        draggable: false,
        position: position
      });
    }
    function createMapPosition(locationAddress) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': locationAddress}, function(results, status) {
        if (google.maps.GeocoderStatus.OK === status) {
          createMapMarker($map, results[0].geometry.location);
        }
      });
    }
    createMapPosition("Milton Keynes, BUCKS");
    createMapPosition("London, UK");
    createMapPosition("San Francisco, CA");
  }

  $(document).ready(function() {
    commandReference();
    $(window).resize(adjustCommandReference);
    filterCommandReference();
    initializeTwitterFeed();
    initializeGithubRepos();
    initializeMaps();
  });
})(jQuery);
