var map;
var data_markers = new Array(0);
var self_markers = new Array(0);
var info_window = new google.maps.InfoWindow();
var traffic = new google.maps.TrafficLayer();
var myPoints = new Array(0);
var myLine = new google.maps.Polyline;
var myPolygon = new google.maps.Polygon;

  function init() {
    // 初期表示（latlng：中心点、zoom：ズーム）
    var latlng = new google.maps.LatLng(38.434476,141.302925);
    var opts = { zoom: 11, mapTypeId: google.maps.MapTypeId.ROADMAP, center: latlng, noClear : false };
    // Mapオブジェクトの生成
    map = new google.maps.Map(document.getElementById('googlemap'), opts);
  }

  function clickable() {
    // クリック制御
    google.maps.event.addListener(map, 'click', function(event){ clickPoint(event.latLng); });
  }

  function removeMarkers(markers) {
    // ボタンが押されたら、マーカーの配列に対して繰り返しsetMap(null)を実行し、地図から削除
    for(var i=0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  function removeMyMarkers() {
    removeMarkers(self_markers);
    myLine.setMap(null);
    myPolygon.setMap(null);
    calcRouteDistance(null);
    calcMyMarkers(null);
  }

  function removeSelfMarkers() {
    myPoints = [];
    removeMyMarkers();
  }

  function putMarkersByTable(type, docid, lat, lng, zoom) {
    removeMarkers(data_markers);
    var content = [];
    var prop = {
      query: {select: 'geometry', from: docid},
      styles: [{ markerOptions: {iconName: "large_green"}  , polygonOptions: {fillColor: "#00ff00", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ff00", strokeWeight: "4"} }]
    };
    if(type==1){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 1", markerOptions: {iconName: "large_blue"}   , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 2", markerOptions: {iconName: "ltblu_circle"} , polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} },
          { where: "rank = 3", markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} },
          { where: "rank = 4", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} }
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
          { where: "rank = 3", markerOptions: {iconName: "large_green"}  , polygonOptions: {fillColor: "#00ff00", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ff00", strokeWeight: "4"} },
          { where: "rank = 4", markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} },
          { where: "rank = 5", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} }
        ]
      };
      content.push('<p>浸水深</p>');
      content.push('<p><div class="color polygonBlue"></div>1.0m未満</p>');
      content.push('<p><div class="color polygonLtblu"></div>1.0m～2.0m</p>');
      content.push('<p><div class="color polygonLtgrn"></div>2.0m～3.0m</p>');
      content.push('<p><div class="color polygonYellow"></div>3.0m～4.0m</p>');
      content.push('<p><div class="color polygonOrange"></div>4.0m～5.0m</p>');
      content.push('<p><div class="color polygonRed"></div>5.0m以上</p>');
    }else if(type==31){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 1", markerOptions: {iconName: "large_purple"} , polygonOptions: {fillColor: "#8000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#8000ff", strokeWeight: "4"} },
          { where: "rank = 2", markerOptions: {iconName: "large_blue"}   , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 3", markerOptions: {iconName: "ltblu_circle"} , polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} }
        ]
      };
      content.push('<p><div class="color polygonPurple"></div>震度2以下</p>');
      content.push('<p><div class="color polygonBlue"></div>震度3</p>');
      content.push('<p><div class="color polygonLtblu"></div>震度4</p>');
    }else if(type==32){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 4", markerOptions: {iconName: "large_green"}  , polygonOptions: {fillColor: "#006600", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#006600", strokeWeight: "4"} },
          { where: "rank = 5", markerOptions: {iconName: "large_green"}  , polygonOptions: {fillColor: "#00ff00", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ff00", strokeWeight: "4"} },
          { where: "rank = 6", markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} }
        ]
      };
      content.push('<p><div class="color polygonGreen"></div>震度5弱</p>');
      content.push('<p><div class="color polygonLtgrn"></div>震度5強</p>');
      content.push('<p><div class="color polygonYellow"></div>震度6弱</p>');
    }else if(type==33){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 7" , markerOptions: {iconName: "pink_circle"}  , polygonOptions: {fillColor: "#ff0080", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff0080", strokeWeight: "4"} },
          { where: "rank = 8" , markerOptions: {iconName: "pink_circle"}  , polygonOptions: {fillColor: "#ff99ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff99ff", strokeWeight: "4"} },
          { where: "rank = 9" , markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} },
          { where: "rank = 10", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff6600", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff6600", strokeWeight: "4"} },
          { where: "rank = 11", markerOptions: {iconName: "large_red"}    , polygonOptions: {fillColor: "#660000", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#660000", strokeWeight: "4"} }
        ]
      };
      content.push('<p><div class="color polygonPink"></div>震度6強-1</p>');
      content.push('<p><div class="color polygonLtpnk"></div>震度6強-2</p>');
      content.push('<p><div class="color polygonOrange"></div>震度6強-3</p>');
      content.push('<p><div class="color polygonDkOrng"></div>震度6強-4</p>');
      content.push('<p><div class="color polygonDkred"></div>震度6強-5</p>');
      content.push('<p><div class="color polygonRed"></div>震度7</p>');
    }else if(type==41){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 1", markerOptions: {iconName: "large_blue"}   , polygonOptions: {fillColor: "#0000ff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#0000ff", strokeWeight: "4"} },
          { where: "rank = 2", markerOptions: {iconName: "ltblu_circle"} , polygonOptions: {fillColor: "#00ffff", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ffff", strokeWeight: "4"} },
          { where: "rank = 3", markerOptions: {iconName: "large_green"}  , polygonOptions: {fillColor: "#00ff00", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#00ff00", strokeWeight: "4"} },
          { where: "rank = 4", markerOptions: {iconName: "large_yellow"} , polygonOptions: {fillColor: "#ffff00", fillOpacity: 0.5, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ffff00", strokeWeight: "4"} }
        ]
      };
      content.push('<p>危険度(木造建物全壊率)</p>');
      content.push('<p><div class="color polygonBlue"></div>危険度1(0～3%)</p>');
      content.push('<p><div class="color polygonLtblu"></div>危険度2(3～5%)</p>');
      content.push('<p><div class="color polygonLtgrn"></div>危険度3(5～7%)</p>');
      content.push('<p><div class="color polygonYellow"></div>危険度4(7～10%)</p>');
    }else if(type==42){
      prop = {
        query: {select: 'geometry', from: docid},
        styles: [
          { where: "rank = 5", markerOptions: {iconName: "orange_circle"}, polygonOptions: {fillColor: "#ff9900", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"}, polylineOptions: {strokeColor: "#ff9900", strokeWeight: "4"} },
          { where: "rank = 6", markerOptions: {iconName: "pink_circle"} , polygonOptions: {fillColor: "#ff0080", fillOpacity: 0.3, strokeColor: "#666666", strokeWeight: "1"},polylineOptions: {strokeColor: "#ff0080", strokeWeight: "4"} }
        ]
      };
      content.push('<p>危険度(木造建物全壊率)</p>');
      content.push('<p><div class="color polygonOrange"></div>危険度5(10～20%)</p>');
      content.push('<p><div class="color polygonPink"></div>危険度6(20～30%)</p>');
      content.push('<p><div class="color polygonRed"></div>危険度7(30～%)</p>');
    }
    var layer = new google.maps.FusionTablesLayer(prop);
    // FusionTablesLayerはKmlLayerと違って中心点やzoomを自動判定してくれない
    map.setCenter(new google.maps.LatLng(lat,lng));
    map.setZoom(zoom);
    layer.setMap(map);
    data_markers.push(layer);
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
    removeMarkers(data_markers);
    var layer = new google.maps.KmlLayer(url);
    // KmlLayerは中心点やzoomは自動
    layer.setMap(map);
    data_markers.push(layer);
  }

  function setTraffic() {
    traffic.setMap(map);
    $('#trafficOn').removeClass('hidden disp').addClass("hidden");
    $('#trafficOff').removeClass('hidden disp').addClass("disp");
  }
  function removeTraffic() {
    traffic.setMap(null);
    $('#trafficOn').removeClass('hidden disp').addClass("disp");
    $('#trafficOff').removeClass('hidden disp').addClass("hidden");
  }

  function setMarkerGeometry(point, info) {
    var marker = new google.maps.Marker({ position: point.geometry.location });
    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
      info_window.setContent(info);
      info_window.open(map, this);
    });
    self_markers.push(marker);
  }

  function searchAddress() {
    removeSelfMarkers();
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
    removeSelfMarkers();
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
    removeSelfMarkers();
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
      var direction = new google.maps.DirectionsRenderer({draggable:true,preserveViewport:false});
      var directionsService = new google.maps.DirectionsService();
      direction.setMap(map);
      //direction.setPanel(document.getElementById("***")); 	//経路情報を表示する場合
      self_markers.push(direction);

      directionsService.route(request, function(response,status){
        if (status == google.maps.DirectionsStatus.OK){
          direction.setDirections(response);
          calcRouteDistance(response);
        }
      });
      google.maps.event.addListener(direction, 'directions_changed', function() {
        calcRouteDistance(direction.directions);
      });
    }else {
      alert('経路の出発地と到着地を入力してください。');
    }
  }

  function calcRouteDistance(routeData){
    if (document.getElementById("calc_route")){
      var distance = 0;
      if (routeData){
        for (i=0; i<routeData.routes[0].legs.length; i++) {
          distance += routeData.routes[0].legs[i].distance.value;
        }
      }
      if (distance == 0){
        document.getElementById("calc_route").innerHTML = '';
      } else{
        distance = distance/1000;
        distance = distance.toFixed(1);
        document.getElementById("calc_route").innerHTML = '　総距離： ' + distance + 'km';
      }
    }
  }

  // クリック時
  function clickPoint(point){
    myPoints.push(point);
    setDrawing();
  }

  function setDrawing(){
    removeMyMarkers();
    if (document.getElementById("draw_route").checked){
      if (myPoints.length > 2) {
        myPoints.splice( 1, myPoints.length-2 );
      }
    }
    drawMyMarkers(myPoints);
    setMyMarkers();
  }

  function drawMyMarkers(point){
    myLine.setMap(null);
    myPolygon.setMap(null);
    if (document.getElementById("draw_line").checked){
      if (point){ myLine = new google.maps.Polyline({ path: point, strokeColor: "#ff6633", strokeOpacity: 1.0, strokeWeight: 3 }); }
      myLine.setMap(map);
    }else if (document.getElementById("draw_area").checked){
      if (point){ myPolygon = new google.maps.Polygon({ paths: point, strokeColor: "#ff6633", strokeOpacity: 0.8, strokeWeight: 2, fillColor: "#ff6633", fillOpacity: 0.35 }); }
      myPolygon.setMap(map);
    }
  }

  function setMyMarkers(){
    for(var i=0; i < myPoints.length; i++) {
      var image = new google.maps.MarkerImage('http://maps.google.co.jp/mapfiles/ms/icons/orange.png', new google.maps.Size(32, 32), new google.maps.Point(0,0), new google.maps.Point(16, 31));
      var marker = new google.maps.Marker({ position: myPoints[(i)], map: map, index_number: i, icon: image, draggable: true });
      self_markers.push(marker);
      if (!(document.getElementById("draw_route").checked)){
        google.maps.event.addListener(marker, 'click', function(){
          var point = this;
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({'latLng':point.getPosition(), 'region':'jp'}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              info_window.setContent(results[0].formatted_address.replace(/^日本, /, ''));
              info_window.open(map, point);
            }
          });
//          クリックしたらポイントを削除
//          myPoints.splice(this.index_number,1);
//          drawMyMarkers(null);
//          removeMarkers(self_markers);
//          setMyMarkers();
        });
        google.maps.event.addListener(marker, 'dragend', function(){
          myPoints.splice(this.index_number, 1);
          myPoints.splice(this.index_number, 0, this.getPosition());
          drawMyMarkers(null);
          removeMarkers(self_markers);
          setMyMarkers();
        });
      }
    }
    if (document.getElementById("draw_route").checked){
      if (myPoints.length == 2){
        var request = {
          origin: myPoints[0],
          destination: myPoints[1],
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
          unitSystem: google.maps.DirectionsUnitSystem.METRIC,
          optimizeWaypoints: true,
          avoidHighways: false,
          avoidTolls: false
        };
        var direction = new google.maps.DirectionsRenderer({draggable:true,preserveViewport:false});
        var directionsService = new google.maps.DirectionsService();
        removeMarkers(self_markers);
        direction.setMap(map);
        self_markers.push(direction);
  
        directionsService.route(request, function(response,status){
          if (status == google.maps.DirectionsStatus.OK){
            direction.setDirections(response);
            calcMyMarkers(response);
          }
        });
        google.maps.event.addListener(direction, 'directions_changed', function() {
          calcMyMarkers(direction.directions);
        });
      } else{
        calcMyMarkers(null);
      }
    } else{
      calcMyMarkers(null);
    }
  }

  function calcMyMarkers(routeData) {
    if (document.getElementById("calc_result")){
      var result = 0;
      if (document.getElementById("draw_route").checked){
        if (routeData){
          var length = routeData.routes[0].legs.length;
          for (i=0; i<length; i++) {
              result += routeData.routes[0].legs[i].distance.value;
              if (i==0){ myPoints[0] = routeData.routes[0].legs[i].start_location; }
              if (i==(length-1)){ myPoints[1] = routeData.routes[0].legs[i].end_location; }
          }
          result = result/1000;
        }
        result = result.toFixed(3);
        document.getElementById("calc_result").innerHTML = '総距離： <span class="calc">' + result + '</span> km';
      }else if (document.getElementById("draw_line").checked){
        result = (google.maps.geometry.spherical.computeLength(myPoints))/1000;
        result = result.toFixed(3);
        document.getElementById("calc_result").innerHTML = '総距離： <span class="calc">' + result + '</span> km';
      }else if (document.getElementById("draw_area").checked){
        result = (google.maps.geometry.spherical.computeArea(myPoints))/(1000*1000);
        result = result.toFixed(3);
        document.getElementById("calc_result").innerHTML = '面積： <span class="calc">' + result + '</span> km<sup>2</sup>';
      }
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
