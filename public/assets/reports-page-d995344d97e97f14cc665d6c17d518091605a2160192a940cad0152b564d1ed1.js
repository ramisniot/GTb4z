function load(){$("#map").length>0&&(initializeGoogleMap(),google.maps.event.addDomListenerOnce(gmap,"idle",function(){var e=document.location.href.split("/")[3],n=document.location.href.split("/")[4];e.match(/home/)||"admin"==e?getRecentReadings(!0,"from_load"):"trip"==n?displayTripOverview():"reports"==e||"devices"==e?getReportBreadcrumbs():"geofence"!=e&&device_id!=undefined&&getBreadcrumbs(device_id)}))}function openInfoWindowHtml(e,n,a,i){window.currentInfoWindow!=undefined&&window.currentInfoWindow.close();var t=i||-50,o={position:e,content:n,disableAutoPan:!1,maxWidth:0,pixelOffset:new google.maps.Size(-140,t),zIndex:null,boxClass:"infobox",infoBoxClearance:new google.maps.Size(1,1),isHidden:!1,pane:"floatPane",enableEventPropagation:!1,closeBoxURL:"/assets/infowindow_close-e1c41755c30d9243aa69542dd1f950d72faaff1c4908a7b83a2081277be29cdd.svg",alignBottom:!i},r=new InfoBox(o);window.currentInfoWindow=r,google.maps.event.addDomListener(r,"closeclick",function(){dev_id=!1,highlightRow(0),window.activeDeviceId=null}),r.open(gmap)}function updateDeviceAddress(e){var n=getDeviceByLastGPSReadingId(e.id);n&&(n.address=n.address.replace("Getting Address...",e.address),updateDeviceRow({id:n.id,helper_standard_location:n.address,dt:n.dt}))}function getLastReadingInfo(){setTimeout("lastReadingInfoCall();",5e3)}function lastReadingInfoCall(){$.get("/readings/get_last_reading_info_for_devices.json").done(function(e){for(var n=0;n<e.length;n++){var a=JSON.parse(e[n]);if(void 0===getReadingById(a.id)&&readings.push(a),null!=a.address){var i=getReadingById(a.id);i&&(i.address=a.address,updated_readings.push(i)),frm_index&&updateDeviceAddress(a)}}load_rgeo_code(),showReadings()})}function getRecentReadings(e,n){$("#updating").show();var a,i=new google.maps.LatLngBounds,t=!1;if(window.dispatchResult!=undefined&&window.dispatchResult.length>0&&i.extend(new google.maps.LatLng(window.dispatchResult[0],window.dispatchResult[1])),"from_load"!=n)a="/readings/recent/"+n+".json",$.ajax({url:a}).done(function(e){window.dispatchResult!=undefined&&window.dispatchResult.length>0&&drawGeocodingResult(window.dispatchResult[0],window.dispatchResult[1]);for(var n=0;n<e.length;n++){var a=e[n];d=getDeviceById(a.id),d&&(d.lat=a.latitude,d.lng=a.longitude,d.speed=a.speed,d.dt=a.dt,d.full_dt=a.full_dt,d.address=a.helper_standard_location,d.last_gps_reading_id=a.last_gps_reading_id,d.direction=a.direction,d.geofence=a.geofence),a.status=e[n].latest_status_html,a.icon_id=e[n].icon_id,a.name=e[n].name,a.id=e[n].id,a.reading_id=e[n].last_location_id,a.lat=a.latitude,a.lng=a.longitude,populate_the_table(a,frm_index,i)}e.length>0&&null!=window.activeDeviceId&&focusOn(window.activeDeviceId),$("#updating").hide(),load_rgeo_code()});else{null!=devices[0]&&(t=!0);for(var o=0;o<devices.length;o++){var r=devices[o];populate_the_table(r,!1,i)}if(t&&(e==undefined||1==e))if(dev_id){var r=getDeviceById(dev_id);new_drag_point||new google.maps.LatLng(r.lat,r.lng);centerMap(dev_id)}else new_drag_point||(google.maps.event.addListenerOnce(gmap,"bounds_changed",function(){this.getZoom()>18&&this.setZoom(18)}),gmap.fitBounds(i));window.dispatchResult!=undefined&&window.dispatchResult.length>0&&drawGeocodingResult(window.dispatchResult[0],window.dispatchResult[1]),$("#updating").hide()}}function drawGeocodingResult(e,n){var a=new google.maps.Marker({position:new google.maps.LatLng(e,n),map:gmap,icon:"/assets/icons/destination-1ee94649d19517dc57c4f1d9620c7e7f803a048a0ddc293e3981bffad9a29db5.png",clickable:!0});google.maps.event.addDomListener(a,"click",function(){openInfoWindowHtml(new google.maps.LatLng(e,n),window.dispatchAddress+'<br /><br />Click <a href="/geofences/new?geofence[radius]=0.1&geofence[latitude]='+e+"&geofence[longitude]="+n+"&geofence[address]="+window.dispatchAddress+'">here</a> to save this Location.<br /><br /><a href="#" onclick="maxZoomTo('+e+","+n+')">Zoom In</a>')}),a.setMap(gmap)}function updateDeviceRow(e){var n=$("#row"+e.id)[0];if(n&&n.getElementsByTagName){var a=n.getElementsByTagName("td");a[1].innerHTML=e.helper_standard_location,e.status&&(a[2].innerHTML=e.status),a[3].innerHTML=e.dt}}function populate_the_table(e,n,a){n&&updateDeviceRow(e);var i=new google.maps.LatLng(e.lat,e.lng);window.markers==undefined&&(window.markers={}),window.markers[e.id]!=undefined&&(window.markers[e.id][0].setMap(null),window.markers[e.id][1].setMap(null));var t=createLabeledMarker(e.id,i,e.name,marker_image(e.icon_id),createDeviceHtml(e.id)),o=createMarker(e.id,i,e.name,createArrow(e.direction,e.speed),createDeviceHtml(e.id));window.markers[e.id]=[t,o],window.markers[e.id][0].setMap(gmap),window.markers[e.id][1].setMap(gmap),a.extend(i)}function marker_image(e){if(null==e)return"/assets/icons/ublip_marker-3c0878cf26221b53d0b44c7d6eaf90e43fd149fcc420026d09842171470a36d7.png";if(e.toString().length<3)switch(e.toString()){case"1":return"/assets/icons/ublip_marker-3c0878cf26221b53d0b44c7d6eaf90e43fd149fcc420026d09842171470a36d7.png";case"2":return"/assets/icons/ublip_red-a94a729480f250f66c3c0323a46f977f8a06da21c5976acd14863f2bcb21af03.png";case"3":return"/assets/icons/green_small-cc34d2c2c83a80756016d52bfc8c1f432a0f05a7a2a95b36e12bae2b6e5e3b59.png";case"4":return"/assets/icons/yellow_small-1ae8e785333694fb3c664547896138a5f40df8b2c12cd38ac083fe05e64b736b.png";case"5":return"/assets/icons/purple_small-b94cbca2b53e0b0e647cf180565fcadcc636e24c8f0021ca011bfa7b67c6e30f.png";case"6":return"/assets/icons/dark_blue_small-d4004b22f46037ad5e85564cac51be46638d6ec8bf6df381a44a7448e4ad58b6.png";case"7":return"/assets/icons/grey_small-3877c4e901a30f9549d88cf57a5792af8b99e5efd83ba01f5b0b1fcf9c39029d.png";case"8":return"/assets/icons/orange_small-86b81cdec0003be42699404532bc5fec45ef621e59b1da0708335f9a40f641c6.png";default:return"/assets/icons/ublip_marker-3c0878cf26221b53d0b44c7d6eaf90e43fd149fcc420026d09842171470a36d7.png"}return e}function centerMap(e){dev_id=e;var n=getDeviceById(e);if(new_drag_point)var a=new_drag_point;else if(n)var a=new google.maps.LatLng(n.lat,n.lng);gmap&&a&&gmap.setCenter(a),n&&openInfoWindowHtml(new google.maps.LatLng(n.lat,n.lng),createDeviceHtml(e))}function getDeviceById(e){for(var n=0;n<devices.length;n++){var a=devices[n];if(a.id==e)return a}return null}function createDeviceHtml(e){var n=getDeviceById(e);if(n){var a=moment(n.full_dt,"DD-MMM-YYYY hh:mm A"),i=a.format("DD MMM"),t=a.format("YYYY"),o=a.format("hh:mm"),r=a.format("a"),d='<div class="tt_container__sidebar"><div class="tt_container__sidebar__date_container"><span class="infobox__date">'+i+'</span><br /><span class="infobox__date">'+t+'</span><br /><span class="infobox__date--bold">'+o+'</span><span class="infobox__date--small">'+r+"</span><br /></div></div>",s='<p class="tt_container__body__name">'+n.name+'</p><span class="tt_container__body__text-small"> was last seen at </span><br /><span><div id="bubble_rgeo_'+n.last_gps_reading_id+'" class="tt_container__body__link">'+n.address+"</div></span>",l="";n.phone_number!=undefined&&""!=n.phone_number&&(l+='<br /><span><a href="tel:'+n.phone_number+'">Call '+n.phone_number+"</span><br />");return'<div class="tt_container">'+d+'<div class="tt_container__body">'+s+'<div class="tt_container__body__text">'+speedAndDirectionHtml(n)+geofenceHtml(n)+"</div>"+l+deviceActionsHtml(n)+'</div><div class="clearfix"></div></div>'}}function deviceActionsHtml(e){var n=e.id,a='<br /><a href="#" class="tt_container__body__link" onclick="maxZoomTo('+e.lat+", "+e.lng+');">Zoom in</a> | <a href="/reports/all/'+n+'" class="tt_container__body__link">View details</a> | ';return e.has_movement_alert_for_current_user!=undefined&&e.has_movement_alert_for_current_user?a+="EZ-Alert has been set":a+='<span id="ezalert_'+n+'"><a href="#" class="tt_container__body__link" title="Instant next movement alert" onclick="$(\'#ezalert_'+n+"').load('/utils/set_movement_alert/"+n+"?lat="+e.lat+"&lng="+e.lng+"');\">EZ-Alert</a><span style='visibility: hidden'> has been set</span></span>",a}function speedAndDirectionHtml(e){if(e.speed!=undefined&&e.direction!=undefined){compass_dir=degrees_to_compass(e.direction,e.speed).toUpperCase();var n=e.speed,a="",i="";if(n!=undefined&&(i=n+" mph"),n!=undefined&&n>0&&"none"!=compass_dir&&(a="Heading "+compass_dir),""!=i&&""!=a)return"<br />"+a+" at "+i;if(0==n)return"Speed: 0 <br />"}return"<br />"}function geofenceHtml(e){return e.geofence!=undefined&&""!=e.geofence?" while "+e.geofence:" "}function focusOn(e){window.activeDeviceId=e,window.currentInfoWindow!=undefined&&window.currentInfoWindow.close(),centerMap(e),highlightRow(e),document.location.href="#device_"+e+"_anchor",$("#device_list_container")&&$("#device_list_container").scrollTop&&$("#device_list_container").scrollTop>20&&($("#device_list_container").scrollTop=$("#device_list_container").scrollTop-20)}function focusOnAndFollow(e){new_drag_point=null,focusOn(e)}function highlightRow(e){if(e!=undefined){var n=document.getElementById("row"+e);n!=undefined&&(prevSelectedRow&&(prevSelectedRow.className=prevSelectedRowClass),e>0&&(prevSelectedRow=n,prevSelectedRowClass=n.className,n.className="selected-row"))}}function getMarkerType(e){return e.start?"/assets/icons/start_marker-3ae82cfe8a0fc1509c62abcdfb26679a4c96265fec9d8ab30409e6056d1a41b7.png":e.stop?"/assets/icons/stop_marker-fcffceb612f9ad972b07936ad3b4a0f7ad3f1444273b49a99cba0611558395d5.png":"/assets/icons/ublip_marker-3c0878cf26221b53d0b44c7d6eaf90e43fd149fcc420026d09842171470a36d7.png"}function createMarker(e,n,a,i,t){var o=new google.maps.Marker({position:n,clickable:!0,zIndex:2*e+1,icon:i,flat:!0,title:a});return o.id=e,google.maps.event.addDomListener(o,"click",function(){window.currentlyDrawingDistanceRuler||(openInfoWindowHtml(n,t),gmap.setCenter(n),o&&o.id&&focusOnAndFollow(o.id))}),null==window.deviceLookupHash&&(window.deviceLookupHash={}),window.deviceLookupHash[o.id]=o,o}function toggleMap(){var e=document.getElementById("left_panel"),n=document.getElementById("right_panel"),a=document.getElementById("toggler");fullScreenMap?($(e).removeClass("reports-content__left--hidden"),$(n).removeClass("reports-content__right--full"),a.src="/assets/collapse-4d0a2cc2eeacfd6091f8ab38a808a13ca527bab7bf497eb11c78a7ae5f806aa3.png",a.parentNode.title="Expand map view",fullScreenMap=!1):($(e).addClass("reports-content__left--hidden"),$(n).addClass("reports-content__right--full"),a.src="/assets/expand-187bd31aa78c78f14cc0752a32796827e71352230802fd9cbd31c2dc24e2ef67.png",a.parentNode.title="Collapse map view",fullScreenMap=!0),google.maps.event.trigger(gmap,"resize")}function select_action(){document.location.href="/home/show_devices?group_type="+$("#group_type").val()}function degrees_to_compass(e,n){return 0===n||null===n||null===e?"none":e>=337.5||e<22.5?"n":e>=22.5&&e<67.5?"ne":e>=67.5&&e<112.5?"e":e>=112.5&&e<157.5?"se":e>=157.5&&e<202.5?"s":e>=202.5&&e<247.5?"sw":e>=247.5&&e<292.5?"w":e>=292.5&&e<337.5?"nw":void 0}function createLabeledMarker(e,n,a,i,t){var o={url:i,scaledSize:new google.maps.Size(28,39)},r=new LabeledMarker(gmap,n,{id:e,point:n,label:a,icon:o,html:t,zIndex:2*e,flat:!0,clickable:!0,labelText:a.replace(/ /g,"&nbsp;"),labelOffset:new google.maps.Size(6,-7)});return r.id=e,r}function createArrow(e,n){var a=degrees_to_compass(e,n),i=new google.maps.Size(13,13),t=new google.maps.Point(6.5,33),o=arrowImgs[a];return new google.maps.MarkerImage(o,null,null,t,i)}function getBreadcrumbs(e){url="/readings/last/"+e,$.ajax({url:url}).done(function(e){for(var n=GXml.parse(e.responseText),a=n.documentElement.getElementsByTagName("id"),i=n.documentElement.getElementsByTagName("lat"),t=n.documentElement.getElementsByTagName("lng"),o=(n.documentElement.getElementsByTagName("alt"),n.documentElement.getElementsByTagName("spd")),r=(n.documentElement.getElementsByTagName("dir"),n.documentElement.getElementsByTagName("geofence")),d=n.documentElement.getElementsByTagName("dt"),s=n.documentElement.getElementsByTagName("address"),l=n.documentElement.getElementsByTagName("event_type"),c=n.documentElement.getElementsByTagName("note"),g=i.length-1;g>=0;g--)if(i[g].firstChild){var f="N/A";s[g].firstChild!=undefined&&(f=s[g].firstChild.nodeValue);var p="";c[g].firstChild!=undefined&&(p=c[g].firstChild.nodeValue);var m=null==r[g].firstChild?null:r[g].firstChild.nodeValue,u=(o[g].firstChild.nodeValue,l[g].firstChild.nodeValue),w={id:a[g].firstChild.nodeValue,lat:i[g].firstChild.nodeValue,lng:t[g].firstChild.nodeValue,address:f,dt:d[g].firstChild.nodeValue,note:p,event:u,geofence:m};readings.push(w);var _=new google.maps.LatLng(w.lat,w.lng),v=getMarkerType(w);0==g?(createMarker(w.id,_,recenticon,createReadingHtml(w.id)),gmap.setCenter(_),openInfoWindowHtml(_,createReadingHtml(w.id)),highlightRow(w.id)):createMarker(w.id,_,v,createReadingHtml(w.id))}})}function getReadingById(e){for(var n=0;n<readings.length;n++){var a=readings[n];if(a.id==e)return a}}function getDeviceByLastGPSReadingId(e){for(var n=0;n<devices.length;n++){var a=devices[n];if(a.last_gps_reading_id==e)return a}}function updateReadingForTrip(e,n,a){reading=getReadingById(e),"undefined"!=typeof reading&&(reading.start=n,reading.stop=a)}function initializeGoogleMap(){window.default_map_type==undefined&&(window.default_map_type=google.maps.MapTypeId.ROADMAP);var e=$("#map").data("default-map-center");window.centerLatLng=new google.maps.LatLng(e.lat,e.lng),gmap=new google.maps.Map($("#map")[0],{zoom:8,center:window.centerLatLng,streetViewControl:!0,mapTypeId:window.default_map_type,mapTypeControl:!0,mapTypeControlOptions:{mapTypeIds:[google.maps.MapTypeId.HYBRID,google.maps.MapTypeId.ROADMAP]},scaleControl:!0,scaleControlOptions:{position:google.maps.ScaleControlStyle.RIGHT},styles:[{featureType:"all",elementType:"labels",stylers:[{visibility:"on"}]}]}),ie<9&&gmap.setTilt(0),google.maps.event.addDomListener(gmap,"closeclick",function(){dev_id=!1,highlightRow(0),window.activeDeviceId=null}),google.maps.event.addDomListener(gmap,"dragend",function(){new_drag_point=gmap.getCenter()}),installMoveListener(),google.maps.event.addDomListener(gmap,"infowindowopen",pauseMoveListener),google.maps.event.addDomListener(gmap,"maptypeid_changed",setMapTypePreference),google.maps.event.addDomListener(gmap,"click",function(){gmap.setOptions({scrollwheel:!0,gestureHandling:"greedy"})}),google.maps.event.addDomListener(gmap,"mouseout",function(){gmap.setOptions({scrollwheel:!1,gestureHandling:"none"})})}function installMoveListener(){window.moveListener=google.maps.event.addDomListener(gmap,"bounds_changed",function(){zoom=gmap.getZoom(),window.mapOverlayVisibilityTimeout&&window.clearTimeout(window.mapOverlayVisibilityTimeout),window.mapOverlayVisibilityTimeout=window.setTimeout("showVisibleMapOverlays();",500)})}function pauseMoveListener(){google.maps.event.removeListener(window.moveListener),window.setTimeout("installMoveListener()",1e3)}function showVisibleMapOverlays(){var e=gmap.getBounds();if(gmap.getZoom()<6||!e)return!1;var n=e.getNorthEast(),a=e.getSouthWest(),i=a.lng(),t=n.lng(),o=n.lat(),r=a.lat();window.remote_url="/utils/ACTION",window.remote_url+="?x1="+i+"&y1="+o+"&x2="+t+"&y2="+r,window.device_id!=undefined&&(window.remote_url+="&d="+window.device_id),null==window.frameSpecificOverlays&&initializeFrameSpecificOverlays(),null==window.frameSpecificOverlayVisibilities&&(window.frameSpecificOverlayVisibilities=["geofences","placemarks"]),(frameSpecificOverlayVisibilitiesIncludes("geofences")||frameSpecificOverlayVisibilitiesIncludes("placemarks"))&&fetchNewGeofencesAndPlacemarks()}function toggleGeofenceVisibility(e){!e.checked&&frameSpecificOverlayVisibilitiesIncludes("geofences")&&(window.frameSpecificOverlayVisibilities=window.frameSpecificOverlayVisibilities.filter(function(e){return"geofences"!=e}),hideFrameSpecificOverlays("geofences"),setViewPreference("geofences",!1)),e.checked&&!frameSpecificOverlayVisibilitiesIncludes("geofences")&&(window.frameSpecificOverlayVisibilities.push("geofences"),frameSpecificOverlayVisibilitiesIncludes("placemarks")?drawFrameSpecificOverlays("geofences"):fetchNewGeofencesAndPlacemarks(),setViewPreference("geofences",!0))}function fetchNewGeofencesAndPlacemarks(){window.remote_url&&$.ajax({url:window.remote_url.replace("ACTION","overlays_in_bounds")}).done(function(transport){var data=transport,evaled=eval("("+data+")");hideFrameSpecificOverlays("all"),window.frameSpecificOverlays.geofences=[],window.frameSpecificOverlays.placemarks=[],window.frameSpecificOverlays.messages=[],createFrameSpecificOverlays(evaled),drawFrameSpecificOverlays("all")})}function hideFrameSpecificOverlays(e){if("all"==e)hideFrameSpecificOverlays("geofences"),hideFrameSpecificOverlays("placemarks");else if(window.frameSpecificOverlays[e]!=undefined)for(var n=0;n<window.frameSpecificOverlays[e].length;n++)window.frameSpecificOverlays[e][n].setMap(null)}function initializeFrameSpecificOverlays(){window.frameSpecificOverlays={geofences:[],placemarks:[],messages:[]},window.frameSpecificOverlayLookupHash={}}function createFrameSpecificOverlays(e){var n;if(e.geofences!=undefined)for(n=0;n<e.geofences.length;n++)window.frameSpecificOverlays.geofences.push(e.geofences[n]["polygonal?"]?createPolygonalGeofence(e.geofences[n]):createCircularGeofence(e.geofences[n]));if(e.placemarks!=undefined)for(n=0;n<e.placemarks.length;n++)window.frameSpecificOverlays.placemarks.push(createPlacemark(e.placemarks[n]));if(e.messages!=undefined){(e.messages[0]!=undefined&&e.messages[0].match(/placemarks/)&&frameSpecificOverlayVisibilitiesIncludes("placemarks")||d_had_a_message)&&createFadingMessage(e.messages[0])}}function drawFrameSpecificOverlays(e){if("all"==e)drawFrameSpecificOverlays("geofences"),drawFrameSpecificOverlays("placemarks"),window.frameSpecificOverlayLookupHash&&window.autoOpenOverlayKey&&window.frameSpecificOverlayLookupHash[window.autoOpenOverlayKey]&&(google.maps.event.trigger(window.frameSpecificOverlayLookupHash[window.autoOpenOverlayKey],"click"),window.autoOpenOverlayKey=null);else if(window.frameSpecificOverlays[e]!=undefined&&frameSpecificOverlayVisibilitiesIncludes(e))for(var n=0;n<window.frameSpecificOverlays[e].length;n++)window.frameSpecificOverlays[e][n].setMap(gmap),window.frameSpecificOverlays[e][n].setOptions({zIndex:n})}function createFadingMessage(e){var n=$("#gmap_message");if(null==n)return!1;n.innerHTML="",e==undefined&&(e=""),""!=e&&null!=n&&(n.style.visibility="visible",n.innerHTML=e),window.timeout!=undefined&&window.clearTimeout(window.timeout),window.timeout=window.setTimeout("$('#gmap_message').hide();",5e3)}function createPlacemark(e){var n=undefined;if(n=e.account_id!=undefined?'<%= image_path("icons/orange_circle.png") %>':'<%= image_path("icons/red_circle.png") %>'){var a=new google.maps.Marker({position:new google.maps.LatLng(e.latitude,e.longitude),title:e.name,icon:n}),i="<div class='notTooWide'><b>Placemark:</b> "+e.name+"<br /><br /><a href='#' onclick='maxZoomTo("+e.latitude+", "+e.longitude+")'>Zoom In</a></div>";return google.maps.event.addDomListener(a,"click",function(){window.activeDeviceId=null,openInfoWindowHtml(new google.maps.LatLng(e.latitude,e.longitude),i)}),window.frameSpecificOverlayLookupHash["p"+e.id]=a,a}return undefined}function maxZoomTo(e,n){gmap.setCenter(new google.maps.LatLng(e,n)),gmap.setZoom(15)}function geofenceInfoWindowHtml(e){return'<div class="tt_container"><div class="tt_container__sidebar"><div class="tt_container__sidebar__text_container">Location</div></div><div class="tt_container__body"><p class="tt_container__body__name">'+e.name+'</p><div class="tt_container__body__link tt_container__body__link--large">'+e.address+'</div><br /><br /><a class="tt_container__body__link" href="#" onclick="zoomToBoundsByCorner('+e.square_bounds.join(", ")+')">Zoom In</a></div><div class="clearfix"></div>'}function zoomToBoundsByCorner(e,n,a,i){gmap.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(e,n),new google.maps.LatLng(a,i)))}function createPolygonalGeofence(e){var n=3,a=.75,i=.1,t=e.polypoints.map(function(e){return new google.maps.LatLng(e.latitude,e.longitude)});(t[0]!=undefined&&t[0].lat()!=t[t.length-1].lat()||t[0].lng()!=t[t.length-1].lng())&&t.push(t[0]);var o=new google.maps.Polygon({path:t,strokeColor:e.color,strokeWeight:n,strokeOpactiy:a,fillColor:e.color,fillOpacity:i}),r=geofenceInfoWindowHtml(e);return google.maps.event.addDomListener(o,"click",function(){window.activeDeviceId=null,openInfoWindowHtml(new google.maps.LatLng(e.latitude,e.longitude),r,null,-110)}),window.frameSpecificOverlayLookupHash["g"+e.id]=o,o}function createCircularGeofence(e){var n=3,a=.75,i=.1,t=new google.maps.Circle({center:new google.maps.LatLng(e.latitude,e.longitude),radius:1609.344*e.radius,strokeColor:e.color,strokeWeight:n,strokeOpactiy:a,fillColor:e.color,fillOpacity:i}),o=geofenceInfoWindowHtml(e);return google.maps.event.addDomListener(t,"click",function(){window.activeDeviceId=null,openInfoWindowHtml(new google.maps.LatLng(e.latitude,e.longitude),o,null,-110)}),window.frameSpecificOverlayLookupHash["g"+e.id]=t,t}function setViewPreference(e,n){var a="/utils/set_view_preference?type="+e+"&checked="+(n?"y":"n");return $.get(a),!0}function setMapTypePreference(){var e="/utils/set_view_preference?map="+gmap.getMapTypeId();return $.get(e),!0}function frameSpecificOverlayVisibilitiesIncludes(e){return auxiliar=window.frameSpecificOverlayVisibilities.filter(function(n){return n==e}),1==auxiliar.length}function changeDevice(e,n,a,i,t){t&&$(t).attr("action","/reports/"+n+"/"+e);var o="";a&&(o+="?start_date="+a),i&&(o+="&end_date="+i),document.location.href="/reports/"+n+"/"+e+o}function displayTripOverview(e){if(e==undefined&&(e=readings[0].id),window.previousTripMarkers!=undefined)for(var n=0;n<window.previousTripMarkers.length;n++)window.previousTripMarkers[n].setMap(null);window.previousTripMarkers=new Array,highlightRow(e);var a=new google.maps.LatLngBounds,i=0;for(n=0;n<readings.length&&i<=1;n++){var t=readings[n],o=new google.maps.LatLng(t.lat,t.lng);t.id==e&&(t.start?(window.previousTripMarkers.push(createMarker(e,o,getMarkerType(t),createTripHtml(t))),a.extend(o),i++):t.stop&&(window.previousTripMarkers.push(createMarker(e,o,getMarkerType(t),createTripHtml(t))),a.extend(o),i++))}gmap.fitBounds(a)}function createTripHtml(e){var n="Getting Address...";return null!=e.address&&(n=e.address),html='<div class="dark_grey"><span class="blue_bold">'+n+"<br />"+e.dt+"</span><br />",html+='<br /><a href="/reports/trip_detail/'+e.id+'">View trip details</a>',html}function centerMapOnReading(e){var n=getReadingById(e),a=new google.maps.LatLng(n.lat,n.lng),i=Math.pow(2,gmap.getZoom()),t=new google.maps.Point(0,30/i||0),o=gmap.getProjection().fromLatLngToPoint(a),r=new google.maps.Point(o.x-t.x,o.y-t.y),d=gmap.getProjection().fromPointToLatLng(r);openInfoWindowHtml(a,createReadingHtml(e),"reports"),gmap.setCenter(d)}function zoomToReadingsBounds(){if(null==readings||0==readings.length)return!0;for(var e=new google.maps.LatLngBounds,n=0;n<readings.length;n++)null!=readings[n]&&null!=readings[n].lat&&null!=readings[n].lng&&e.extend(new google.maps.LatLng(readings[n].lat,readings[n].lng));gmap.setCenter(e.getCenter()),gmap.fitBounds(e)}function getReportBreadcrumbs(){for(var e=0;e<readings.length;e++){var n=readings[e].id,a=new google.maps.LatLng(readings[e].lat,readings[e].lng);createMarker(n,a,getMarkerType(readings[e]),createReadingHtml(n),2*n),readings[e].start||readings[e].stop||readings[e].direction&&createMarker(n,a,createArrow(readings[e].direction,readings[e].speed),createReadingHtml(n),2*n+1),0==e&&(gmap.setCenter(a),gmap.setZoom(15),openInfoWindowHtml(a,createReadingHtml(n),"reports"),highlightRow(n))}}function createReadingHtml(e){var n=getReadingById(e),a="Getting Address...";null!=n.address&&(a=n.address);var i=moment(n.full_dt,"DD-MMM-YYYY hh:mm A"),t=i.format("DD MMM"),o=i.format("YYYY"),r=i.format("hh:mm"),d=i.format("a"),s='<div class="tt_container"><div class="tt_container__sidebar tt_container__sidebar--small"><div class="tt_container__sidebar__date_container tt_container__sidebar__date_container--small"><span class="infobox__date">'+t+'</span><br /><span class="infobox__date">'+o+'</span><br /><span class="infobox__date--bold">'+r+'</span><span class="infobox__date--small">'+d+'</span><br /></div></div><div class="tt_container__body tt_container__body--small"><span class="tt_container__body__text-small">'+a+'</span><br /><div class="tt_container__body__text-small">'+speedAndDirectionHtml(n)+" "+geofenceHtml(n)+"</div><br />";return n.device_phone_number!=undefined&&""!=n.device_phone_number&&(s+='<span><a href="tel:'+n.device_phone_number+'">Call '+n.device_phone_number+"</span><br />"),s+="</div><div class='clearfix'></div></div>"}function createMarker(e,n,a,i,t,o){var r="string"==typeof a?{url:a,scaledSize:new google.maps.Size(28,39)}:a,d=new google.maps.Marker({position:n,zIndex:t,icon:r,title:o});return d.id=e,d.setMap(gmap),google.maps.event.addDomListener(d,"click",function(){centerMapOnReading(e),highlightRow(e)}),null==window.deviceLookupHash&&(window.deviceLookupHash={}),window.deviceLookupHash[d.id]=d,d}var gmap,prevSelectedRow,prevSelectedRowClass,currSelectedDeviceId,dev_id,device_id,devices=[],readings=[],grp_id,fullScreenMap=!1,infowindow,new_drag_point,zoom=15,rgeo_counter=0,arrowImgs={e:"/assets/icons/arrows/e-5c033ed3f63c81a8d063b6d01403ef3b9eb630b9da36bbd9b218a15f76ba9bac.png",n:"/assets/icons/arrows/n-599f84be1b85eaa603192932f58c92c987dd2dee95f43c2794535810465fe0a3.png",ne:"/assets/icons/arrows/ne-ca07eb4afd779f61ffe4de34479f8e91fd4008ed2cef03d552dd46c95b313d13.png",none:"/assets/icons/arrows/none-8f3b7670aed999b32ff52d1e351bcc00f8faecf4b3c417f9092fe44cd650feab.png",nw:"/assets/icons/arrows/nw-cbf5244b691e6b0249404ee046b7eacc8497625ca1a4b646eb73ed1f0f424a04.png",s:"/assets/icons/arrows/s-b87d84fd676de8560c819bdc4247c052cc6ea98b09a3ce5485e2801a23bfa0f0.png",se:"/assets/icons/arrows/se-e68ed3007f18c2f849208042edd5128973d6d4622e38e388f3ca4561ba66c63d.png",sw:"/assets/icons/arrows/sw-87e6c4918e8425166a489fe1fc299a84b307d6c9b950eae36117f6e8a075a93e.png",w:"/assets/icons/arrows/w-3d55d3d2c2dc2ba9da93c403b6a321321b4dd8fff8b978def53eee0c820bfb53.png"};initializeFrameSpecificOverlays();var ie=function(){for(var e,n=3,a=document.createElement("div"),i=a.getElementsByTagName("i");a.innerHTML="<!--[if gt IE "+ ++n+"]><i></i><![endif]-->",i[0];);return n>4?n:e}();