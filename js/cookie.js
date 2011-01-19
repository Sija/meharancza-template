var Cookie = {
  get: function(name) {
    var name = escape(name) + '=';
    if (document.cookie.indexOf(name) >= 0) {
      var cookies = document.cookie.split(/\s*;\s*/)
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].indexOf(name) == 0) {
          return unescape(cookies[i].substring(name.length, cookies[i].length));
        }
      }
    }
    return null;
  },

  set: function(name, value, options) {
    var newcookie = [escape(name) + "=" + escape(value)];
    if (options) {
      if (options.expires) newcookie.push("expires=" + options.expires.toGMTString());
      if (options.path)    newcookie.push("path=" + options.path);
      if (options.domain)  newcookie.push("domain=" + options.domain);
      if (options.secure)  newcookie.push("secure");
    }
    document.cookie = newcookie.join('; ');
  }
};
