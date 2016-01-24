var Vue = require('vue');
var getOffset = function(element) {
  var result = {
    top:element.offsetTop,
    left:element.offsetLeft
  };
  var parent = element.offsetParent;

  while(parent !== null) {
    result.top += parent.offsetTop;
    result.left += parent.offsetLeft;
    parent = parent.offsetParent;
  }

  return result;
};
export default {
  twoWay: true,
  params: ['format'],
  bind() {
    var DatePicker = require('./datepicker.vue');
    var that = this;
    var dateFilter = require('./dateFilter').default;

    that.el.addEventListener('focus', () => {
      if (!that.picker) {
        var datepickerWrapper = document.createElement('div');
        var offset = getOffset(that.el);

        datepickerWrapper.style.position = 'absolute';
        datepickerWrapper.style.zIndex = 1000;
        datepickerWrapper.style.left = offset.left + 'px';
        datepickerWrapper.style.top = offset.top + that.el.clientHeight + 'px';
        that.picker = new Vue(Object.assign({ el: datepickerWrapper}, DatePicker));
        that.picker.$appendTo(document.body);

        that.picker.$on('pick', function(arg) {
          that.picker.$el.style.display = 'none';
          that.set(dateFilter(new Date(arg.date), that.params.format));
        });
      }
      that.picker.show();
    });
    document.body.addEventListener('click', function(ev) {
      if (!that.picker || ev.target === that.el) return;
      that.picker.hide();
    });
  }
};
