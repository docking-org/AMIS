'use strict';

var img_color = 1;
var bg_color = 1;
let contrastTomato = '100%';
let contrastDAPI = '100%';
let itemIndex = 0;
let control = 'positive';
let sex = 'false';
var total_result = 0;
var pos_mouse_number = "";
var pos_mouse_number_female = "";
var neg_mouse_number_female = "";
var pos_DAPI_list = [];
var pos_tomato_list = [];
var neg_DAPI_list = [];
var neg_tomato_list = [];
var split = false;

var $frame = $('#forcecentered');
var $wrap = $frame.parent();

var slyOptions = {
    horizontal: 1,
    itemNav: 'forceCentered',
    smart: 1,
    activateMiddle: 1,
    activateOn: 'click',
    mouseDragging: 1,
    touchDragging: 1,
    releaseSwing: 1,
    startAt: selected_slice,
    scrollBar: $wrap.find('.scrollbar_left'),
    scrollBy: 1,
    speed: 300,
    elasticBounds: 1,
    easing: 'easeOutExpo',
    dragHandle: 1,
    dynamicHandle: 1,
    clickBar: 1,

    prev: $wrap.find('.prev'),
    next: $wrap.find('.next')
};

change_bg();
show_loader();
scalebar_change();

if ($('#sample_dropdown').val().length + $('#gene_dropdown').val().length +
    $('#organ_dropdown').val().length + $('#experiment_dropdown').val().length > 0) {
    updateFilter(0);
    updateSpecimen();

} else {
    setDefaultDDlVal(1, 1, 1, 1);
}

var map = L.map('map').setView([0, 0], 3);


var map_right = document.getElementById('map');

var observer = new MutationObserver(function (mutations) {
    console.log("updating map left")
    updateMap();
});
observer.observe(map_right, {
    attributes: true,
    attributeFilter: ['data-high-res-src']
});


// let contrastSliderDAPI = document.getElementById('contrast-slider-left-dapi');
// let contrastLabelDAPI = document.getElementById('contrast-value-left-dapi');
// contrastSliderDAPI.addEventListener('input', function (e) {
//     let value = e.target.value;
//     contrastLabelDAPI.textContent = value + '%';
//     contrastDAPI = value + '%';
//     updateMap();
// });

// let contrastSliderTomato = document.getElementById('contrast-slider-left-td-tomato');
// let contrastLabelTomato = document.getElementById('contrast-value-left-td-tomato');
// contrastSliderTomato.addEventListener('input', function (e) {
//     let value = e.target.value;
//     contrastLabelTomato.textContent = value + '%';
//     contrastTomato = value + '%';
//     updateMap();
// });

let lutTomato = '';
let lutDropdownTomato = document.getElementById('lut-left-td-tomato');
lutDropdownTomato.addEventListener('input', function (e) {
    let value = e.target.value;
    lutTomato = value
    updateMap();
});



//updating leaflet map
function updateMap() {
    map.off();
    map.remove();
    var img_path = $('#map').attr('data-high-res-src');
    //var img_path = "/666/GPR85_Ai9_1_1_2505_f_p30_reporter-gene-cross_brain_955_c_1_00009_10x_Olympus_tdTomato_2984fc7f4ce470bef52c83f067179d9d_Simple Segmentation"
    var img_path_DAPI = $('#map').attr('data-high-res-src-DAPI');

    let filter_tomato = [
        'brightness:100%',
        `contrast:${contrastTomato}`,
        'grayscale:0%',
        'opacity:50%',
    ];

    let filter_dapi = [
        'brightness:100%',
        `contrast:${contrastDAPI}`,
        'grayscale:0%',
        'opacity:50%',
    ];

    var tile_DAPI = L.tileLayer.colorFilter(img_path_DAPI + '/{z}/{x}/{y}.png', {
        minZoom: 2,
        maxZoom: 7,
        tms: true,
        crs: L.CRS.Simple,
        noWrap: true,
        maxBoundsViscosity: 1.0,
        filter: filter_dapi
    });

    var tile_tomato = L.tileLayer.lut(img_path + '/{z}/{x}/{y}.png', {
        minZoom: 2,
        maxZoom: 7,
        tms: true,
        crs: L.CRS.Simple,
        noWrap: true,
        maxBoundsViscosity: 1.0,
        lut: lutTomato
    });

    // var r = L.tileLayer(img_path+'/{z}/{x}/{y}-r.png', {
    //     minZoom: 2,
    //     maxZoom: 7,1
    //     tms: true,
    //     crs: L.CRS.Simple,
    //     noWrap: true,
    //     maxBoundsViscosity: 1.0,
    //     transparent: true,

    // });
    // var g = L.tileLayer(img_path+'/{z}/{x}/{y}-g.png', {
    //     minZoom: 2,
    //     maxZoom: 7,
    //     tms: true,
    //     crs: L.CRS.Simple,
    //     noWrap: true,
    //     maxBoundsViscosity: 1.0,
    //     transparent: true,

    // });
    // var b = L.tileLayer(img_path+'/{z}/{x}/{y}-b.png', {
    //     minZoom: 2,
    //     maxZoom: 7,
    //     tms: true,
    //     crs: L.CRS.Simple,
    //     noWrap: true,
    //     maxBoundsViscosity: 1.0,
    //     transparent: true 
    // });


    // var annotation = L.tileLayer(img_path2+'/{z}/{x}/{y}.png', {
    //     minZoom: 2,
    //     maxZoom: 7,
    //     tms: true,
    //     crs: L.CRS.Simple,
    //     noWrap: true,
    //     transparent: true,
    //     format: 'image/png',
    //     maxBoundsViscosity: 1.0
    // });

    map = L.map('map', {
        center: [-49, -49],
        zoom: 2,
        layers: [tile_tomato]
    });

    var baseMaps = {

    };

    var overlayMaps = {
        "tdTomato": tile_tomato,
        "DAPI": tile_DAPI,
    };

    // var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

    map.addControl(new L.Control.Fullscreen());

    // annotation.getContainer().classList.add('leaflet-tile');
    // map.on('click', function(e) {
    //     alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    // });
    resize();
}


$('#sample_dropdown').change(function () {
    scalebar_change();
    slyOptions['startAt'] = 0;
    pos_mouse_number = "";
    neg_mouse_number = "";
    pos_mouse_number_female = "";
    neg_mouse_number_female = "";
    updateFilter(0);
    $("#gene_dropdown").val($("#gene_dropdown option:eq(0)").val());
    $("#organ_dropdown").val($("#organ_dropdown option:eq(0)").val());
    $("#experiment_dropdown").val($("#experiment_dropdown option:eq(0)").val());
    updateSpecimen();
});

$('#gene_dropdown').change(function () {
    slyOptions['startAt'] = 0;
    pos_mouse_number = "";
    neg_mouse_number = "";
    pos_mouse_number_female = "";
    neg_mouse_number_female = "";
    updateFilter(1);
    updateSpecimen();
});

$('#organ_dropdown').change(function () {
    slyOptions['startAt'] = 0;
    pos_mouse_number = "";
    neg_mouse_number = "";
    pos_mouse_number_female = "";
    neg_mouse_number_female = "";
    updateFilter(2);
    updateSpecimen();
});

$('#experiment_dropdown').change(function () {
    slyOptions['startAt'] = 0;
    pos_mouse_number = "";
    neg_mouse_number = "";
    pos_mouse_number_female = "";
    neg_mouse_number_female = "";
    updateFilter(3);
    updateSpecimen();
});


$("#specimen_above").on('click', '.btn', function (event) {
    console.log("specimen above");
    slyOptions['startAt'] = 0;
    pos_mouse_number = $(this).find('input').val();
    updateAreaC();
});

$(".current_id").change(function () {
    console.log("changed id");
    if ($('.current_id').val() > parseInt($('.total_result').text())) {
        $('.current_id').val(parseInt($('.total_result').text()));
    }
    var current = parseInt($('.current_id').val()) - 1;
    slyOptions['startAt'] = current;
    updateAreaC();
});

$(".clear_filter").on('click', function (event) {
    no_result();
    selected_slice = 0;
    total_result = 0;
    pos_DAPI_list = [];
    pos_tomato_list = [];
    neg_DAPI_list = [];
    neg_tomato_list = [];
    $("#sample_dropdown").val($("#sample_dropdown option:eq(0)").val());
    $("#gene_dropdown").val($("#gene_dropdown option:eq(0)").val());
    $("#organ_dropdown").val($("#organ_dropdown option:eq(0)").val());
    $("#experiment_dropdown").val($("#experiment_dropdown option:eq(0)").val());
    updateFilter(0);
    updateSpecimen();
});

function reloadMap() {
    pos_tomato_list = [];
    pos_DAPI_list = [];
    loadLayers("DAPI", pos_DAPI_list);
    loadLayers("tdTomato", pos_tomato_list);

    updateAreaC();
    updateMap();
}


$("#wavelength .btn").on('click', function (event) {


    wavelength = $(this).val();

    itemIndex = parseInt($('.current_id').val()) - 1;
    slyOptions['startAt'] = itemIndex;
    reloadMap();

});

$("#control .btn").on('click', function (event) {
    console.log("changing control");
    control = $(this).find('input').val();
    itemIndex = parseInt($('.current_id').val()) - 1;
    slyOptions['startAt'] = itemIndex;
    reloadMap();
});

$("#sex .btn").on('click', function (event) {
    console.log("changing sex");
    sex = $(this).find('input').val();
    itemIndex = parseInt($('.current_id').val()) - 1;
    slyOptions['startAt'] = itemIndex;

    reloadMap();
});


function setDefaultDDlVal(s1, s2, s3, s4) {
    console.log("showdefaulltddlval");
    if ($('#sample_dropdown').val().length == 0) {
        $("#sample_dropdown").val($("#sample_dropdown option:eq(1)").val());
        updateFilter(s1);
        updateSpecimen();
    }
}

function show_table() {
    console.log("show_table");
    $(".loader").hide();
    $('.no_result').hide();
    $('.image_table').show();
}

function show_loader() {
    console.log("show_loader");
    $('.image_table').hide();
    $('.no_result').hide();
    $(".loader").show();
}

function no_result() {
    console.log("no_result");
    $('.no_result').show();
    $(".loader").hide();
    $('.image_table').hide();
    $('.slice_details').hide();
    $('.current_id').val(0);
    $('.clearfix').html("");
    $('#wavelength').hide();
}

function show_result() {
    console.log("show_result");
    $('.no_result').hide();
    $('.slice_details').show();
    $('.image_table').show();
    $('#wavelength').show();
    $('#control').show();
    $('#sex').show();
    show_table();
}

function scalebar_change() {
    if ($('#sample_dropdown').val().toLowerCase() == "cleared") {
        $('#img_histological').hide();
        $('#img_cleared').show();
    } else {
        $('#img_cleared').hide();
        $('#img_histological').show();
    }
}

function updateFilter(selected) {
    show_loader();
    var url = "/filters?";

    if ($('#sample_dropdown').val().length > 0) {
        url += "&instrument=" + $('#sample_dropdown').val();
        $('#sample_dropdown').css('color', 'black');
    } else {
        $('#sample_dropdown').css('color', 'red');
    }

    if (selected >= 1 && $('#gene_dropdown').val().length > 0) {
        url += "&gene=" + $('#gene_dropdown').val();
    }
    if ($('#gene_dropdown').val().length > 0) {
        $('#gene_dropdown').css('color', 'black');
    } else {
        $('#gene_dropdown').css('color', 'red');
    }

    if (selected >= 2 && $('#organ_dropdown').val().length > 0) {
        url += "&organ=" + $('#organ_dropdown').val();
    }
    if ($('#organ_dropdown').val().length > 0) {
        $('#organ_dropdown').css('color', 'black');
    } else {
        $('#organ_dropdown').css('color', 'red');
    }

    if (selected >= 3 && $('#experiment_dropdown').val().length > 0) {
        url += "&experiment=" + $('#experiment_dropdown').val();
    }

    var gene_arr = [];
    var genes = "<option value=\"\">Select</option>";
    var organ_arr = [];
    var organs = "<option value=\"\">Select</option>";
    var experiment_arr = [];
    var experiments = "<option value=\"\">Select</option>";
    $.ajax({
        type: 'GET',
        url: url,
        "dataType": "json",
        "dataSrc": "items",
        error: function (jqXHR, status, err) {

        }
    }).done(function (data) {
        for (var i in data.items) {
            gene_arr.push(data.items[i].gene);
            organ_arr.push(data.items[i].organ);
            experiment_arr.push(data.items[i].experiment);
        }
        if (selected < 1) {
            gene_arr.sort();
            gene_arr = gene_arr.filter(onlyUnique);
            gene_arr.forEach(function (item) {
                if ($('#gene_dropdown').val() != "" && item == $('#gene_dropdown').val()) {
                    genes += "<option value='" + item + "' selected>";
                    genes += item + "</option>";
                } else {
                    genes += "<option value='" + item + "'>" + item + "</option>";
                }
            });
        }

        if (selected < 2) {
            organ_arr.sort();
            organ_arr = organ_arr.filter(onlyUnique);
            organ_arr.forEach(function (item) {
                if ($('#organ_dropdown').val() != "" && item == $('#organ_dropdown').val()) {
                    organs += "<option value='" + item + "' selected>";
                    organs += item + "</option>";
                } else {
                    organs += "<option value='" + item + "'>" + item + "</option>";
                }
            });
        }

        if (selected < 3) {
            experiment_arr.sort();
            experiment_arr = experiment_arr.filter(onlyUnique);
            experiment_arr.forEach(function (item) {
                if ($('#experiment_dropdown').val() != "" && item == $('#experiment_dropdown').val()) {
                    experiments += "<option value='" + item + "' selected>";
                    experiments += item + "</option>";
                } else {
                    experiments += "<option value='" + item + "'>" + item + "</option>";
                }
            });
        }

        if (selected == 0) {
            $('#gene_dropdown').html(genes);
            $('#organ_dropdown').html(organs);
            $('#experiment_dropdown').html(experiments);
        }
        if (selected == 1) {
            $('#organ_dropdown').html(organs);
            $('#experiment_dropdown').html(experiments);
        }
        if (selected == 2) {
            $('#experiment_dropdown').html(experiments);
        }

        if (selected == -1) {
            $('#experiment_dropdown').html(experiments);
        }

    });

}

function check_mandatory_ddl() {
    var selects = 0;
    if ($('#sample_dropdown').val().length > 0) {
        selects++;
        $('#sample_dropdown').css('color', 'black');
    } else {
        $('#sample_dropdown').css('color', 'red');
    }

    if ($('#gene_dropdown').val().length > 0) {
        selects++;
        $('#gene_dropdown').css('color', 'black');
    } else {
        $('#gene_dropdown').css('color', 'red');
    }

    if ($('#organ_dropdown').val().length > 0) {
        selects++;
        $('#organ_dropdown').css('color', 'black');
    } else {
        $('#organ_dropdown').css('color', 'red');
    }
    return selects;
}


function updateAreaA(index) {
    console.log("updateareaa");
    if (index != -1) {
        if (total_result == 0) {
            $('.current_id').val(0);
        } else {
            $('.current_id').val(index + 1);
        }
        const element = document.getElementById("map");
        switch (wavelength) {


            case 'tdTomato':
                element.setAttribute('src', pos_tomato_list[index] + ".webp");
                break;
            case 'DAPI':
                element.setAttribute('src', pos_DAPI_list[index] + ".webp");
                break;
        }
        element.setAttribute('data-high-res-src', pos_tomato_list[index]);
        element.setAttribute('data-high-res-src-DAPI', pos_DAPI_list[index]);
        var id = $('._' + index).attr('id');
        show_result();
        updateSliceDetail(id);
    }
}


function loadLayers(toLoad, list) {
    console.log("load_layers");

    var area_a_url = "/slices?per_page=-1&order_by=slice_id";
    if ($('#gene_dropdown').val().length > 0) {
        area_a_url += "&gene=" + $('#gene_dropdown').val();
    }
    if ($('#organ_dropdown').val().length > 0) {
        area_a_url += "&organ=" + $('#organ_dropdown').val();
    }
    if ($('#experiment_dropdown').val().length > 0) {
        area_a_url += "&experiment=" + $('#experiment_dropdown').val();
    }
    if ($('#sample_dropdown').val().length > 0) {
        area_a_url += "&instrument=" + $('#sample_dropdown').val();
    }

    area_a_url += "&wavelength=" + toLoad;

    if (control == 'negative') {
        if (sex == 'false') {
            area_a_url += "&mouse_number=" + neg_mouse_number;
        }
        else {
            area_a_url += "&mouse_number=" + neg_mouse_number_female;
        }
    }
    else {
        if (sex == 'false') {
            area_a_url += "&mouse_number=" + pos_mouse_number;
        }
        else {
            area_a_url += "&mouse_number=" + pos_mouse_number_female;
        }
    }

    $.ajax({
        type: 'GET',
        url: area_a_url,
        "dataType": "json",
        "dataSrc": "items",
        success: function (data) {
            for (var i in data.items) {
                list.push(data.items[i].img_no_ext);
            }
        }
    })
}


function updateAreaC() {
    console.log("update area c")
    var area_a_url = "/slices?per_page=-1&order_by=slice_id";
    if ($('#gene_dropdown').val().length > 0) {
        area_a_url += "&gene=" + $('#gene_dropdown').val();
    }
    if ($('#organ_dropdown').val().length > 0) {
        area_a_url += "&organ=" + $('#organ_dropdown').val();
    }
    if ($('#experiment_dropdown').val().length > 0) {
        area_a_url += "&experiment=" + $('#experiment_dropdown').val();
    }
    if ($('#sample_dropdown').val().length > 0) {
        area_a_url += "&instrument=" + $('#sample_dropdown').val();
    }
    if (wavelength == "tdTomato-RI") {
        area_a_url += "&wavelength=tdTomato";
    } else {
        area_a_url += "&wavelength=" + wavelength;
    }

    if (control === 'negative') {
        if (sex == 'false') {
            area_a_url += "&mouse_number=" + neg_mouse_number;
        }
        else {
            area_a_url += "&mouse_number=" + neg_mouse_number_female;
        }

    }
    else {
        if (sex === 'false') {
            area_a_url += "&mouse_number=" + pos_mouse_number;
        }
        else {
            area_a_url += "&mouse_number=" + pos_mouse_number_female;

        }
    }
    console.log("area_a_url_left: " + area_a_url);

    $.ajax({
        type: 'GET',
        url: area_a_url,
        "dataType": "json",
        "dataSrc": "items",
        success: function (data) {
            console.log(data);
            var content = "";
            total_result = 0;
            for (var i in data.items) {
                total_result++;
                content += "<li class='_" + i + "' id='" + data.items[i].id + "'><img src='";
                if (wavelength === "tdTomato-RI") {
                    content += data.items[i].img_small_RI;
                } else {
                    content += data.items[i].img_small;
                }
                content += "' width='180px' ></li>";
            }

            if (img_color === 1) {
                img_color = 2;
            } else {
                img_color = 1;
            }
            changeFilter();


            updateAreaA(itemIndex);


            $('.total_result').html(total_result);
            $('.current_id').attr("max", total_result);
            $('.current_id').attr("min", 1);
            if (content.length === 0) {
                $('.clearfix').html("<li>N/A</li>");
            } else {
                $('.clearfix').html(content);
            }

            $frame.sly(false);
            $frame.sly(slyOptions);
            $frame.sly('on', 'active', function (eventName, itemIndex) {
                console.log("slice clicked");
                updateAreaA(itemIndex);
            });
        }, error: function (jqXHR, status, err) {

        }
    });
}


function updateSliceDetail(id) {
    $.ajax({
        type: 'GET',
        url: "/slices?id=" + id,
        "dataType": "json",
        "dataSrc": "items",
        success: function (data) {
            var content = "";
            for (var i in data.items) {
                content += "<br/><br/><p>Probe: " + data.items[i].gene + "</p>";
                content += "<p>MD5: <b>" + data.items[i].checksum + "</b></p>";
                content += "<p><a href=" + data.items[i].tif_url + ">Download TIF file (raw 16 bit)</a></p>";
                content += "<p>Shareable URL: <button class='glyphicon glyphicon-copy copyUrl btn btn-info' ";
                content += " title='click here to copy Shareable URL'></button></p>";
                content += "<div id='url' style='display:none;'>https://amis.docking.org/img_browser";
                content += "?";
                if ($('#gene_dropdown').val().length > 0) {
                    content += "gene=" + $('#gene_dropdown').val();
                }
                if ($('#organ_dropdown').val().length > 0) {
                    content += "&organ=" + $('#organ_dropdown').val();
                }
                if ($('#experiment_dropdown').val().length > 0) {
                    content += "&experiment=" + $('#experiment_dropdown').val();
                }
                if ($('#sample_dropdown').val().length > 0) {
                    content += "&instrument=" + $('#sample_dropdown').val();
                }
                content += "<br/>&wavelength=" + wavelength;
                if (control === 'positive') {
                    if (sex === 'false') {
                        content += "&pos_mouse_number=" + pos_mouse_number;
                    }
                    else {
                        content += "&pos_mouse_number=" + pos_mouse_number_female;
                    }
                }
                else {
                    if (sex === 'false') {
                        content += "&neg_mouse_number=" + neg_mouse_number;
                    }
                    else {
                        content += "&neg_mouse_number=" + neg_mouse_number_female;
                    }
                }
                content += "&selected_slice=" + $('.current_id').val() + "</div>";
            }
            $('.slice_details').html(content);
        }, error: function (jqXHR, status, err) {
            $('.alert-danger .text').text(err.toLowerCase() + '!');
            $('.alert-danger').show();
        }
    });
}

function updateSpecimen() {
    console.log("update speciment");
    if (check_mandatory_ddl() < 3) {

        no_result();
    } else {
        let uri = "/mice?";
        if ($('#gene_dropdown').val().length > 0) {
            uri += "&gene=" + $('#gene_dropdown').val();
        }
        if ($('#organ_dropdown').val().length > 0) {
            uri += "&organ=" + $('#organ_dropdown').val();
        }
        if ($('#experiment_dropdown').val().length > 0) {
            uri += "&experiment=" + $('#experiment_dropdown').val();
        }
        if ($('#sample_dropdown').val().length > 0) {
            uri += "&instrument=" + $('#sample_dropdown').val();
        }


        $.ajax({
            type: 'GET',
            url: uri,
            "dataType": "json",
            "dataSrc": "items",
            success: function (data) {


                data.items.sort(compareValues('number', 'asc'));
                data.items.sort(compareValues('sex', 'asc'));
                data.items.sort(compareValues('spec', 'asc'));

                for (var i in data.items) {

                    if (data.items[i].spec === '+') {
                        if (data.items[i].sex) {
                            pos_mouse_number_female = data.items[i].number;
                        } else {
                            pos_mouse_number = data.items[i].number;
                        }
                    }
                    if (data.items[i].spec === '-') {
                        if (data.items[i].sex) {
                            neg_mouse_number_female = data.items[i].number;
                        } else {
                            neg_mouse_number = data.items[i].number;
                        }
                    }
                }



                reloadMap();


            }, error: function (jqXHR, status, err) {
                $('.alert-danger .text').text(err.toLowerCase() + '!');
                $('.alert-danger').show();
            }
        });
    }
}

function changeFilter() {
    if (img_color == 1) {
        $(".area_A img").css('-webkit-filter', 'brightness(10) invert(1)');
        $(".area_B img").css('-webkit-filter', 'brightness(10) invert(1)');
        $(".frame li img").css('-webkit-filter', 'brightness(10) invert(1)');
        $(".frame li").css('background', '#fff');
        img_color = 2;
    } else {
        $(".area_A img").css('-webkit-filter', '');
        $(".area_B img").css('-webkit-filter', '');
        $(".frame li  img").css('-webkit-filter', '');
        $(".frame li").css('background', '#000');
        img_color = 1;
    }
}

$(".btn-change-color").click(function () {
    changeFilter();
});

$(".btn-change-bg-color").click(function () {
    change_bg();
});

$(".btn-toggle-split").click(function () {
    toggle_split();

});

function toggle_split() {
    if (split) {
        $("#split-left").removeClass("col-md-6");
        $("#split-left").addClass("col-md-12");
        $("#split-right").css('display', "none");
        split = false;

        updateAreaC();
    }
    else {
        $("#split-left").addClass("col-md-6");
        $("#split-left").removeClass("col-md-12");
        $("#split-right").css('display', "block");


        $("#sample_dropdown_right").val($("#sample_dropdown").val());
        $("#experiment_dropdown_right").val($("#experiment_dropdown").val());
        $("#organ_dropdown_right").val($("#organ_dropdown").val());
        $("#gene_dropdown_right").val($("#gene_dropdown").val());

        updateAreaC();

        split = true;
    }
}

function change_bg() {
    if (bg_color == 1) {
        $("body").css('background-color', '#000');
        $("body").css('color', '#fff');
        bg_color = 2;
    } else {
        $("body").css('background-color', '#fff');
        $("body").css('color', '#000');
        bg_color = 1;
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function compareValues(key, order = 'asc') {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {

            return 0;
        }

        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order == 'desc') ? (comparison * -1) : comparison
        );
    };
}

