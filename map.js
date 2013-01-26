var map, markers, infowindow;

  ///// memo ///// drugなんかの制御は入っていない
  function initialize() {
    markers = new google.maps.MVCArray();
    infowindow = new google.maps.InfoWindow();

    // 初期表示（latlng：中心点、zoom：ズーム）
    var latlng = new google.maps.LatLng(35.7,139.7);
    var opts = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latlng,
      noClear : false
    };
    // Mapオブジェクトの生成
    map = new google.maps.Map(document.getElementById('map'), opts);
  }

  function removeMarkers() {
    // ボタンが押されたら、マーカーの配列に対して繰り返しsetMap(null)を実行し、地図から削除
    markers.forEach(function(marker, idx) {
      marker.setMap(null);
    });
    // document.getElementById('routeTaxt').innerHTML='';
  }

  function putMarkers() {
    // 存在しているマーカーを全て削除してからレンダリングしたい
    removeMarkers();
    map.setCenter(new google.maps.LatLng(35.67,139.75));
    map.setZoom(15);

    var latlng1 = new google.maps.LatLng(35.667539, 139.750997);
    var marker1 = new google.maps.Marker({
      position: latlng1
    });
    marker1.setMap(map);
    markers.push(marker1);

    var latlng2 = new google.maps.LatLng(35.666484,139.758132);
    var marker2 = new google.maps.Marker({
      position: latlng2
    });
    marker2.setMap(map);
    markers.push(marker2);
  }

  function putMarkersByTable() {
    // 存在しているマーカーを全て削除してからレンダリングしたい
    removeMarkers();
    var layer = new google.maps.FusionTablesLayer('1f8XtypI68eT4oQZOr-ukZ5EOKq8t9lpTEyOoJ58', {suppressInfoWindows:false});
    // 中心点やzoomサイズも固定指定ではなく、自動で取れるようには最終的にしたほうが良いかも
    map.setCenter(new google.maps.LatLng(35.68,139.76));
    map.setZoom(13);

    layer.setMap(map);
    markers.push(layer);
  }

  function searchAddress() {
    removeMarkers();
    var address = document.getElementById("address").value;
    if(address != ''){
      var geocoder = new google.maps.Geocoder();
      var latlng;

      geocoder.geocode({'address':address, 'region':'jp'}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          for(var i=0; i < results.length; i++){
            latlng = results[i].geometry.location;
            map.setCenter(latlng);
            putMarkersBySearch(results[i], results[i].formatted_address.replace(/^日本, /, ''));
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
    var place = document.getElementById("place").value;
    if(place != ''){
      var places = new google.maps.places.PlacesService(map);
      var latlng = map.getCenter();
      var request = {
          location: new google.maps.LatLng(latlng.lat(), latlng.lng()),
          radius: '50000',
          name: place
          //types: ['store']
      };

      places.search(request, function(results, status) { 
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i=0; i < results.length; i++){
            putMarkersBySearch(results[i], results[i].name);
          }
        }else {
          alert('施設名を特定できませんでした。');  
        } 
      });  
    }else {
      alert('施設名を入力してください。');  
    }
  }

  function putMarkersBySearch(point, info) {
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

  function searchRoute() {
    removeMarkers();
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
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
      route.setPanel(document.getElementById("routeTaxt"));
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
