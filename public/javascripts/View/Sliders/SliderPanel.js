Ext.define('YMU.View.Sliders.SliderPanel', {
    extend: 'Ext.panel.Panel',
    id: 'slider-panel',
    width: 730,
    html: '<p id="loading">Loading<p>',
    currentPanel: 1,
    interval: 5000,
    afterRender: function(comp, obj) {
      //;
      return this.callParent(arguments);
    },
    loader: {
      autoLoad: true,
      listeners: {
    	  load: function(){
    			  this.getTarget().initializeSlider();
    	  }
      },
      url: 'slider-content.html',
      loadMask: true
    },
    startSliding: function(){
    	this.slidePanelTimer = setInterval(this.autoRotate, this.interval);
    },
    stopSliding: function(){
    	clearInterval(this.slidePanelTimer);
    },
    destroy: function(){
        this.stopSliding();
        delete(this.slidePanelTimer);
        return true;
    },
    initializeSlider: function() {
      var slider=this,addHandler, clearClass, createIcon, dh, i, iconIncr, initial, legend, legendElements, legendIcons, panelContainer, slideCount;
      legendIcons = [];
      iconIncr = 0;
      createIcon = function(icon) {
        var icn;
        iconIncr++;
        icn = {
          tag: 'div',
          cls: 'legend-icon',
          html: iconIncr
        };
        return legendIcons.push(icn);
      };
      panelContainer = Ext.get('panel-container');
      if (navigator.appName === 'Microsoft Internet Explorer') {
        slideCount = 4;
      } else {
        slideCount = 4;//slider.el.dom.firstChild.children[0].children[0].childElementCount;
      }
      i = 0;
      while (i < slideCount) {
        createIcon(i);
        i++;
      }
      legend = {
        tag: 'div',
        id: 'legend',
        cls: 'legend',
        cn: [legendIcons]
      };
      dh = Ext.DomHelper;
      dh.append('panel-slider', legend);
      legendElements = Ext.get("legend");
      initial = legendElements.first();
      initial.addCls('legend-active');
      panelContainer.addListener('mouseover', function() {
        return clearInterval(slider.slidePanelTimer);
      });
      panelContainer.addListener('mouseout', function() {
        return slider.slidePanelTimer = setInterval(slider.autoRotate, slider.interval);
      });
      clearClass = function(element) {
        element.removeCls('legend-active');
        if (element.next()) return clearClass(element.next());
      };
      addHandler = function(element) {
        if (element !== null) {
          element.addListener('mouseover',function(evt){
             slider.stopSliding(); 
          });
          element.addListener('click', function(evt) {
            if (panelContainer.getActiveAnimation() != false){
               return;
            }
            var clickedPanel, diff, direction, move, x;
            clearClass(Ext.get("legend").first());
            element.addCls('legend-active');
            clickedPanel = parseInt(element.dom.innerText);
            clickedPanel || (clickedPanel = parseInt(element.dom.innerHTML));
            if (slider.currentPanel === clickedPanel) return;
            if (clickedPanel > slider.currentPanel) {
              diff = clickedPanel - slider.currentPanel;
              move = diff * slider.width;
              direction = 'left';
            } else {
              diff = slider.currentPanel - clickedPanel;
              move = diff * slider.width;
              direction = 'right';
            }
            slider.currentPanel = clickedPanel;
            x = slider.currentPanel;
            return panelContainer.move(direction, move, true);
          });
          return addHandler(element.next());
        }
      };
      addHandler(initial);
      slider.autoRotate = function() {
        var direction, distance;
        slider.currentPanel++;
        clearClass(initial);
        distance = slider.width;
        direction = "left";
        if (slider.currentPanel === slideCount + 1) {
          distance = slider.width * slideCount - slider.width;
          direction = "right";
          slider.currentPanel = 1;
        }
        panelContainer.move(direction, distance, true);
        clearClass(initial);
        for (x = 1; x < slider.currentPanel+1; x++){
                if(x == 1){ 
                    var cel = initial;
                }else{
                    cel = cel.next();
                }
                if (x == slider.currentPanel){
                    cel.addCls('legend-active');
                }
                    
            };
        return this;
      };
      slider.slidePanelTimer = setInterval(slider.autoRotate, slider.interval);
      return slider;
    }
});
