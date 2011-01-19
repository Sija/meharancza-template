
Object.extend(String.prototype, {
  random: function(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var length = length || 6;
    var rnum, seed = '';

    for(var i = 0; i < length; i++) {
    	rnum = Math.floor(Math.random() * chars.length);
    	seed += chars.substring(rnum, rnum + 1);
    }
    return(seed);
  },

  toNicename: function() {
    return(this.replace('_', '-').replace(' ', '-').replace('#', ''));
  }
});

var iStorage = new JS.Interface(['load', 'save', 'getAll', 'get', 'set']);
var Storage  = new JS.Class({
	id:     null,
	data:   null,

	initialize: function(id, data) {
		if (!!id) {
			this.id = id;
		} else {
			throw new Exception('No storage ID provided');
		}
		this.data = new Hash();
		if (data) {
		  this.data.update(data);
		}
		this.load();
	},

	load: function() {
		return true;
	},

	save: function() {
		return true;
	},

	getAll: function() {
		return this.data;
	},

	get: function(key, def) {
		return this.data.get(key) || def || null;
	},

	set: function(key, value) {
		this.data.set(key, value);
	}
});

var CookieStorage = new JS.Class(Storage, {
	load: function() {
		var data = Cookie.get(this.id);
		if (!!data && data.isJSON()) {
			this.data.update(data.evalJSON());
		}
	},

	save: function() {
		Cookie.set(this.id, Object.toJSON(this.data));
	}
});

var Application = new JS.Class({
	storage: null,

  initialize: function() {
    this.storage = new CookieStorage('pl.gibbon.leaves', {
      'ui.layout.fluid'   : false,
      'ui.sidebar.visible': true
    });
    var self = this;

  	$$('.styleswitch').invoke('observe', 'click', function(event) {
  		self.switchStyleTo(this.readAttribute('rel'));
  		event.stop();
  	});

  	var oldStyle = this.storage.get('ui.style');
  	if (oldStyle) {
  		this.switchStyleTo(oldStyle);
  	}

  	$('layoutSwitch').observe('click', function(event) {
  		self.layout.toggle();
  		self.persist();
  		event.stop();
  	});
  	$('sidebarSwitch').observe('click', function(event) {
  		self.sidebar.toggle();
  		self.persist();
  		event.stop();
  	});

  	if (this.storage.get('ui.layout.fluid')) {
  		self.layout.makeFluid();
    }
  	if (!this.storage.get('ui.sidebar.visible')) {
  		self.sidebar.hide();
  	}
  },

  persist: function() {
  	this.storage.set('ui.layout.fluid', this.layout.isFluid());
  	this.storage.set('ui.sidebar.visible', this.sidebar.visible());
  	this.storage.save();
	},

  switchStyleTo: function(name) {
  	$$('link[@rel*=style][@title]').each(function(i) {
  		this.writeAttribute('disabled', !(this.readAttribute('title') == name));
  	});
  	this.storage.set('ui.style', name);
  },

	sidebar: {
		show: function() {
			return $('sidebar').show();
		},
		hide: function() {
			return $('sidebar').hide();
		},
		toggle: function() {
			return $('sidebar').toggle();
		},
		visible: function() {
			return $('sidebar').visible();
		}
	},

	layout: {
		makeFluid: function() {
			return $(document.body).addClassName('fluid');
		},
		makeStatic: function() {
			return $(document.body).removeClassName('fluid');
		},
		toggle: function() {
			return $(document.body).toggleClassName('fluid');
		},
		isFluid: function() {
			return $(document.body).hasClassName('fluid') == true;
		},
		isStatic: function() {
			return $(document.body).hasClassName('fluid') == false;
		}
	}
});

var app = null;

document.observe('dom:loaded', function() {
  app = new Application();
});
