/*
        License here,
        I dont think too  much about licence
        just feel free to do anything you want... :-)
*/
var PrettyJSON = { view: {}, tpl: {} };
PrettyJSON.util = {
  isObject: function (v) {
    return Object.prototype.toString.call(v) === '[object Object]';
  },
  pad: function (str, length) {
    str = String(str);
    while (str.length < length) str = '0' + str;
    return str;
  },
  dateFormat: function (date, f) {
    f = f.replace('YYYY', date.getFullYear());
    f = f.replace('YY', String(date.getFullYear()).slice(-2));
    f = f.replace('MM', PrettyJSON.util.pad(date.getMonth() + 1, 2));
    f = f.replace('DD', PrettyJSON.util.pad(date.getDate(), 2));
    f = f.replace('HH24', PrettyJSON.util.pad(date.getHours(), 2));
    f = f.replace('HH', PrettyJSON.util.pad(date.getHours() % 12, 2));
    f = f.replace('MI', PrettyJSON.util.pad(date.getMinutes(), 2));
    f = f.replace('SS', PrettyJSON.util.pad(date.getSeconds(), 2));
    return f;
  },
};
PrettyJSON.tpl.Node =
  '' +
  '<span class="node-container">' +
  '<span class="node-top node-bracket" />' +
  '<span class="node-content-wrapper">' +
  '<ul class="node-body" />' +
  '</span>' +
  '<span class="node-down node-bracket" />' +
  '</span>';
PrettyJSON.tpl.Leaf =
  '' +
  '<span class="leaf-container">' +
  '<span class="<%= type %>"> <%-data%></span><span><%= coma %></span>' +
  '</span>';
PrettyJSON.view.Node = Backbone.View.extend({
  tagName: 'span',
  data: null,
  level: 1,
  path: '',
  type: '',
  size: 0,
  isLast: true,
  rendered: false,
  events: {
    'click .node-bracket': 'collapse',
    'mouseover .node-container': 'mouseover',
    'mouseout .node-container': 'mouseout',
  },
  initialize: function (opt) {
    this.options = opt;
    this.data = this.options.data;
    this.level = this.options.level || this.level;
    this.path = this.options.path;
    this.isLast = _.isUndefined(this.options.isLast) ? this.isLast : this.options.isLast;
    this.dateFormat = this.options.dateFormat;
    var m = this.getMeta();
    this.type = m.type;
    this.size = m.size;
    this.childs = [];
    this.render();
    if (this.level == 1) this.show();
  },
  getMeta: function () {
    var val = { size: _.size(this.data), type: _.isArray(this.data) ? 'array' : 'object' };
    return val;
  },
  elements: function () {
    this.els = {
      container: $(this.el).find('.node-container'),
      contentWrapper: $(this.el).find('.node-content-wrapper'),
      top: $(this.el).find('.node-top'),
      ul: $(this.el).find('.node-body'),
      down: $(this.el).find('.node-down'),
    };
  },
  render: function () {
    this.tpl = _.template(PrettyJSON.tpl.Node);
    $(this.el).html(this.tpl);
    this.elements();
    var b = this.getBrackets();
    this.els.top.html(b.top);
    this.els.down.html(b.bottom);
    this.hide();
    return this;
  },
  renderChilds: function () {
    var count = 1;
    _.each(
      this.data,
      function (val, key) {
        var isLast = count == this.size;
        count = count + 1;
        var path = this.type == 'array' ? this.path + '[' + key + ']' : this.path + '.' + key;
        var opt = {
          key: key,
          data: val,
          parent: this,
          path: path,
          level: this.level + 1,
          dateFormat: this.dateFormat,
          isLast: isLast,
        };
        var child =
          PrettyJSON.util.isObject(val) || _.isArray(val)
            ? new PrettyJSON.view.Node(opt)
            : new PrettyJSON.view.Leaf(opt);
        child.on(
          'mouseover',
          function (e, path) {
            this.trigger('mouseover', e, path);
          },
          this
        );
        child.on(
          'mouseout',
          function (e) {
            this.trigger('mouseout', e);
          },
          this
        );
        var li = $('<li/>');
        var colom = '&nbsp;:&nbsp;';
        var left = $('<span />');
        var right = $('<span />').append(child.el);
        this.type == 'array' ? left.html('') : left.html(key + colom);
        left.append(right);
        li.append(left);
        this.els.ul.append(li);
        child.parent = this;
        this.childs.push(child);
      },
      this
    );
  },
  isVisible: function () {
    return this.els.contentWrapper.is(':visible');
  },
  collapse: function (e) {
    e.stopPropagation();
    this.isVisible() ? this.hide() : this.show();
    this.trigger('collapse', e);
  },
  show: function () {
    if (!this.rendered) {
      this.renderChilds();
      this.rendered = true;
    }
    this.els.top.html(this.getBrackets().top);
    this.els.contentWrapper.show();
    this.els.down.show();
  },
  hide: function () {
    var b = this.getBrackets();
    this.els.top.html(b.close);
    this.els.contentWrapper.hide();
    this.els.down.hide();
  },
  getBrackets: function () {
    var v = { top: '{', bottom: '}', close: '{ ... }' };
    if (this.type == 'array') {
      v = { top: '[', bottom: ']', close: '[ ... ]' };
    }
    v.bottom = this.isLast ? v.bottom : v.bottom + ',';
    v.close = this.isLast ? v.close : v.close + ',';
    return v;
  },
  mouseover: function (e) {
    e.stopPropagation();
    this.trigger('mouseover', e, this.path);
  },
  mouseout: function (e) {
    e.stopPropagation();
    this.trigger('mouseout', e);
  },
  expandAll: function () {
    _.each(
      this.childs,
      function (child) {
        if (child instanceof PrettyJSON.view.Node) {
          child.show();
          child.expandAll();
        }
      },
      this
    );
    this.show();
  },
  collapseAll: function () {
    _.each(
      this.childs,
      function (child) {
        if (child instanceof PrettyJSON.view.Node) {
          child.hide();
          child.collapseAll();
        }
      },
      this
    );
    if (this.level != 1) this.hide();
  },
});
PrettyJSON.view.Leaf = Backbone.View.extend({
  tagName: 'span',
  data: null,
  level: 0,
  path: '',
  type: 'string',
  isLast: true,
  events: { 'mouseover .leaf-container': 'mouseover', 'mouseout .leaf-container': 'mouseout' },
  initialize: function (opt) {
    this.options = opt;
    this.data = this.options.data;
    this.level = this.options.level;
    this.path = this.options.path;
    this.type = this.getType();
    this.dateFormat = this.options.dateFormat;
    this.isLast = _.isUndefined(this.options.isLast) ? this.isLast : this.options.isLast;
    this.render();
  },
  getType: function () {
    var m = 'string';
    var d = this.data;
    if (_.isNumber(d)) m = 'number';
    else if (_.isBoolean(d)) m = 'boolean';
    else if (_.isDate(d)) m = 'date';
    else if (_.isNull(d)) m = 'null';
    return m;
  },
  getState: function () {
    var coma = this.isLast ? '' : ',';
    var state = { data: this.data, level: this.level, path: this.path, type: this.type, coma: coma };
    return state;
  },
  render: function () {
    var state = this.getState();
    if (state.type == 'date' && this.dateFormat) {
      state.data = PrettyJSON.util.dateFormat(this.data, this.dateFormat);
    }
    if (state.type == 'null') {
      state.data = 'null';
    }
    if (state.type == 'string') {
      state.data = state.data == '' ? '""' : '"' + state.data + '"';
    }
    this.tpl = _.template(PrettyJSON.tpl.Leaf);
    $(this.el).html(this.tpl(state));
    return this;
  },
  mouseover: function (e) {
    e.stopPropagation();
    var path = this.path + '&nbsp;:&nbsp;<span class="' + this.type + '"><b>' + this.data + '</b></span>';
    this.trigger('mouseover', e, path);
  },
  mouseout: function (e) {
    e.stopPropagation();
    this.trigger('mouseout', e);
  },
});
