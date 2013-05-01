var map, markers, infowindow;

  function init() {
    markers = new google.maps.MVCArray();
    infowindow = new google.maps.InfoWindow();

    // 初期表示（latlng：中心点、zoom：ズーム）
    var latlng = new google.maps.LatLng(38.434476,141.302925);
    var opts = {
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latlng,
      noClear : false
    };
    // Mapオブジェクトの生成
    map = new google.maps.Map(document.getElementById('googlemap'), opts);
  }

  function removeMarkers() {
    // ボタンが押されたら、マーカーの配列に対して繰り返しsetMap(null)を実行し、地図から削除
    markers.forEach(function(marker, idx) {
      marker.setMap(null);
    });
  }

  function setCenter(lat, lng, zoom) {
    map.setCenter(new google.maps.LatLng(lat,lng));
    map.setZoom(zoom);
  }

  function putMarkersByTable(type, docid, lat, lng, zoom) {
    removeMarkers();
    var content = [];
    var prop = {
      query: {select: 'geometry', from: docid},
      styles: [{ markerOptions: {iconName: "large_green"}  , polygonOptions: {fillColor: "#00ff00", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ff00", strokeWeight: "4"} }]
    };
    if(type==1){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 1", markerOptions: {iconName: "large_blue"}  , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 2", markerOptions: {iconName: "ltblu_circle"}, polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} },
          { where: "rank = 3", markerOptions: {iconName: "large_yellow"}, polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} },
          { where: "rank = 4", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"},polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} }
        ]
      };
      content.push('<p>浸水深</p>');
      content.push('<p><div class="color polygonBlue"></div>0.5m未満</p>');
      content.push('<p><div class="color polygonLtblu"></div>0.5m～1.0m</p>');
      content.push('<p><div class="color polygonYellow"></div>1.0m～2.0m</p>');
      content.push('<p><div class="color polygonOrange"></div>2.0m～5.0m</p>');
      content.push('<p><div class="color polygonRed"></div>5.0m以上</p>');
    }else if(type==2){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 1", markerOptions: {iconName: "large_blue"}   , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 2", markerOptions: {iconName: "ltblu_circle"} , polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} },
          { where: "rank = 3", markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} },
          { where: "rank = 4", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} },
          { where: "rank = 5", markerOptions: {iconName: "pink_circle"}  , polygonOptions: {fillColor: "#ff0080", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff0080", strokeWeight: "4"} }
        ]
      };
      content.push('<p>浸水深</p>');
      content.push('<p><div class="color polygonBlue"></div>1.0m未満</p>');
      content.push('<p><div class="color polygonLtblu"></div>1.0m～2.0m</p>');
      content.push('<p><div class="color polygonYellow"></div>2.0m～3.0m</p>');
      content.push('<p><div class="color polygonOrange"></div>3.0m～4.0m</p>');
      content.push('<p><div class="color polygonPink"></div>4.0m～5.0m</p>');
      content.push('<p><div class="color polygonRed"></div>5.0m以上</p>');
    }else if(type==31){
      prop = {
        query: {select: 'geometry', from: docid, where: 'rank < 7'},
        styles: [
          { where: "rank = 1", markerOptions: {iconName: "large_blue"}   , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 2", markerOptions: {iconName: "ltblu_circle"} , polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} },
          { where: "rank = 3", markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} },
          { where: "rank = 4", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} },
          { where: "rank = 5", markerOptions: {iconName: "pink_circle"}  , polygonOptions: {fillColor: "#ff0080", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff0080", strokeWeight: "4"} }
        ]
      };
      content.push('<p><div class="color polygonBlue"></div>震度2以下</p>');
      content.push('<p><div class="color polygonLtblu"></div>震度3</p>');
      content.push('<p><div class="color polygonYellow"></div>震度4</p>');
      content.push('<p><div class="color polygonOrange"></div>震度5弱</p>');
      content.push('<p><div class="color polygonPink"></div>震度5強</p>');
      content.push('<p><div class="color polygonRed"></div>震度6弱</p>');
    }else if(type==32){
      prop = {
        query: {select: 'geometry', from: docid, where: 'rank >= 7'},
        styles: [
          { where: "rank = 7" , markerOptions: {iconName: "large_blue"}   , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 8" , markerOptions: {iconName: "ltblu_circle"} , polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} },
          { where: "rank = 9" , markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} },
          { where: "rank = 10", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} },
          { where: "rank = 11", markerOptions: {iconName: "pink_circle"}  , polygonOptions: {fillColor: "#ff0080", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff0080", strokeWeight: "4"} }
        ]
      };
      content.push('<p><div class="color polygonBlue"></div>震度6強 1</p>');
      content.push('<p><div class="color polygonLtblu"></div>震度6強 2</p>');
      content.push('<p><div class="color polygonYellow"></div>震度6強 3</p>');
      content.push('<p><div class="color polygonOrange"></div>震度6強 4</p>');
      content.push('<p><div class="color polygonPink"></div>震度6強 5</p>');
      content.push('<p><div class="color polygonRed"></div>震度7</p>');
    }else if(type==41){
      prop = {
        query: {select: 'geometry', from: docid, where: 'rank < 5'},
        styles: [
          { where: "rank = 1", markerOptions: {iconName: "large_blue"}   , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 2", markerOptions: {iconName: "ltblu_circle"} , polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} },
          { where: "rank = 3", markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} },
          { where: "rank = 4", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} }
        ]
      };
      content.push('<p>危険度(木造建物全壊率)</p>');
      content.push('<p><div class="color polygonBlue"></div>危険度1(0～3%)</p>');
      content.push('<p><div class="color polygonLtblu"></div>危険度2(3～5%)</p>');
      content.push('<p><div class="color polygonYellow"></div>危険度3(5～7%)</p>');
      content.push('<p><div class="color polygonOrange"></div>危険度4(7～10%)</p>');
    }else if(type==42){
      prop = {
        query: {select: 'geometry', from: docid, where: 'rank >= 5'},
        styles: [
          { where: "rank = 5", markerOptions: {iconName: "large_purple"}, polygonOptions: {fillColor: "#8000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#8000ff", strokeWeight: "4"} },
          { where: "rank = 6", markerOptions: {iconName: "pink_circle"} , polygonOptions: {fillColor: "#ff0080", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"},polylineOptions: {strokeColor: "#ff0080", strokeWeight: "4"} }
        ]
      };
      content.push('<p>危険度()</p>');
      content.push('<p><div class="color polygonBlue"></div>危険度5(10～20%)</p>');
      content.push('<p><div class="color polygonLtblu"></div>危険度6(20～30%)</p>');
      content.push('<p><div class="color polygonYellow"></div>危険度7(30～%)</p>');
    }
alert(type + ':' + prop["query"]["from"]);
    var layer = new google.maps.FusionTablesLayer(prop);
    // 中心点やzoomも固定指定ではなく、自動で取れるようには最終的にしたほうが良いかも
    setCenter(lat, lng, zoom);

    layer.setMap(map);
    markers.push(layer);

    // 凡例を表示
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear();
    if(content.length > 0){
      var legend = document.createElement('div');
      legend.id = 'legend';
      legend.innerHTML = content.join('');
      legend.index = 1;
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
    }
  }

  function putMarkersByKml(url) {
    removeMarkers();
    var layer = new google.maps.KmlLayer(url);
    // KmlLayerは中心点やzoomは自動
    layer.setMap(map);
    markers.push(layer);
  }

  function setMarkerGeometry(point, info) {
    var marker = new google.maps.Marker({
      position: point.geometry.location
    });
    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(info);
      infowindow.open(map, this);
    });
    markers.push(marker);
  }

  function setTraffic() {
   traffic = new google.maps.TrafficLayer();
   traffic.setMap(map);
   $('#trafficOn').removeClass('hidden disp').addClass("hidden");
   $('#trafficOff').removeClass('hidden disp').addClass("disp");
  }
  function removeTraffic() {
   traffic.setMap(null);
   $('#trafficOn').removeClass('hidden disp').addClass("disp");
   $('#trafficOff').removeClass('hidden disp').addClass("hidden");
  }


  function searchAddress() {
    removeMarkers();
    var address = document.getElementById("search_address").value;
    if(address != ''){
      var geocoder = new google.maps.Geocoder();
      var latlng;

      geocoder.geocode({'address':address, 'region':'jp'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          for(var i=0; i < results.length; i++){
            latlng = results[i].geometry.location;
            map.setCenter(latlng);
            setMarkerGeometry(results[i], results[i].formatted_address.replace(/^日本, /, ''));
          }
        } else {
          alert('住所から場所を特定できませんでした。最初にビル名などを省略し、番地までの検索などでお試しください。');  
        }  
      });  
    }else {
      alert('住所を入力してください。');  
    }
  }

  function searchPlace() {
    removeMarkers();
    var place = document.getElementById("search_place").value;
    if(place != ''){
      var places = new google.maps.places.PlacesService(map);
      var latlng = map.getCenter();
      var request = {
          location: new google.maps.LatLng(latlng.lat(), latlng.lng()),
          radius: '50000',
          name: place
          //types: ['store'] 	//タイプを限定する場合
      };
      places.search(request, function(results, status) { 
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i=0; i < results.length; i++){
            setMarkerGeometry(results[i], results[i].name);
          }
        }else {
          alert('施設名を特定できませんでした。');  
        } 
      });  
    }else {
      alert('施設名を入力してください。');  
    }
  }

  function searchRoute() {
    removeMarkers();
    var from = document.getElementById("search_from").value;
    var to = document.getElementById("search_to").value;
    if(from != '' && to != ''){
      var request = { 
        origin: from, 
        destination: to, 
        travelMode: google.maps.DirectionsTravelMode.DRIVING, 
        unitSystem: google.maps.DirectionsUnitSystem.METRIC, 
        optimizeWaypoints: true, 
        avoidHighways: false, 
        avoidTolls: false 
      };
      var route = new google.maps.DirectionsRenderer({draggable:true,preserveViewport:false});
      var directions = new google.maps.DirectionsService();
      route.setMap(map);
      //route.setPanel(document.getElementById("***")); 	//経路情報を表示する場合
      markers.push(route);

      directions.route(request, function(response,status){
        if (status == google.maps.DirectionsStatus.OK){
          route.setDirections(response);
        }
      });
    }else {
      alert('経路の出発地と到着地を入力してください。');  
    }
  }


// 選択制御
function dispChild(parent, child) {
  $('select[name="'+parent+'"]').change(function () {
    $('#'+parent+' ~ div').removeClass('hidden disp').addClass("hidden");
    $('#'+parent+' ~ input').removeClass('hidden disp').addClass("hidden");
    $('#'+parent+' ~ div>select').removeClass("hidden disp").addClass("hidden");
    $('#'+parent+' ~ div>select').prop('selectedIndex', 0);
    $('#'+parent+' ~ div>select>option:selected').prop('selected', false);
    var pval = $('select[name="'+parent+'"][class="disp"]').val();
    if(pval){
      $('#'+child).removeClass('hidden disp').addClass("disp");
      if($('#'+child).nodeName!="INPUT") {
        $('#'+child+'_'+pval).removeClass('hidden disp').addClass("disp");
      }
    }
  }).trigger("change");
}
function dispGeorss(name) {
  $('#if_georss').empty();
  var id = $('#'+name).val();
  if(id) {
    var val = $('#'+name+'_'+id).val();
    if(val) {
      putMarkersByKml(val);
      var html = '<iframe class="if_georss" seamless marginwidth="0" marginheight="0" frameborder="0" src="/help/' +id+ '" width="100%"></iframe>';
      $('#if_georss').html(html);
    }else{
      alert('マップの種類を選択してください');
    }
  }else{
    alert('マップの種類を選択してください');
  }
}
function dispFusiontable(name) {
  var val = $('select[name="'+name+'"][class="disp"]').val();
  if(val) {
    var table = JSON.parse(val);
    if($.isArray(table)) {
      putMarkersByTable(table[0], table[1], table[2], table[3], table[4]);
    }else{
      alert('マップの種類と地区を選択してください');
    }
  }else{
    alert('マップの種類と地区を選択してください');
  }
}
