
jQuery(function ($) {
    'use strict';

    var img_color = 1;
    var bg_color = 1;
    let contrastTomato_right = '100%';
    let contrastDAPI_right = '100%';
    let itemIndex_right = 0;
    let control_right = 'positive';
    let sex_right = 'false';
    var total_result_right = 0;
    var pos_mouse_number_right = "";
    var pos_mouse_number_right_female = "";
    var neg_mouse_number_right_female = "";
    var neg_mouse_number_right = "";
    var pos_DAPI_list_right = [];
    var pos_tomato_list_right = [];
    var neg_DAPI_list_right = [];
    var neg_tomato_list_right = [];


    var $frame_right = $('#forcecentered_right');

    var $wrap_right = $frame_right.parent();

    var slyOptions_right = {
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: 1,
        activateMiddle: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: selected_slice_right,
        scrollBar: $wrap_right.find('.scrollbar_right'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

        prev: $wrap_right.find('.prev_right'),
        next: $wrap_right.find('.next_right')
    };




    show_loader_right();
    scalebar_change_right();
    resize_right();


    $(".btn-toggle-split").click(function () {
        pos_mouse_number_right = pos_mouse_number;
        pos_mouse_number_right_female = pos_mouse_number_female;
        neg_mouse_number_right = neg_mouse_number;
        neg_mouse_number_right_female = neg_mouse_number_right_female;
        control_right = control;
        sex_right = sex;
        wavelength_right = wavelength;
        contrastTomato_right = contrastTomato;
        contrastDAPI_right = contrastDAPI;
        pos_DAPI_list_right = pos_DAPI_list;
        pos_tomato_list_right = pos_tomato_list;
        neg_DAPI_list_right = neg_DAPI_list;
        neg_tomato_list_right = neg_tomato_list;
        itemIndex_right = itemIndex;
        total_result_right = total_result;
        selected_slice_right = selected_slice;

        if (control_right === 'positive') {
            $('.btn-positive').addClass('active');
            $('.btn-negative').removeClass('active');
        }
        else {
            $('.btn-negative').addClass('active');
            $('.btn-positive').removeClass('active');
        }


        if (sex_right === 'false') {
            $('.btn-mars').addClass('active');
            $('.btn-venus').removeClass('active');
        }
        else {
            $('.btn-venus').addClass('active');
            $('.btn-mars').removeClass('active');
        }


        updateAreaA_right();
        updateAreaC_right();


    });


    if ($('#sample_dropdown_right').val().length + $('#gene_dropdown_right').val().length +
        $('#organ_dropdown_right').val().length + $('#experiment_dropdown_right').val().length > 0) {
        update_filter_right(0);
        updateSpecimen_right();

    } else {
        setDefaultDDlVal(1, 1, 1, 1);
    }


    $(document).on('click', '.copyUrl_right', function (event) {
        $temp = $("<input>");
        $("body").append($temp);
        $temp.val($('#url').text()).select();
        document.execCommand("copy");
        $temp.remove();
    });


    function resize_right() {
        var map = document.getElementById("map_right");

        map.style.height = "55vh";
        map.style.width = "100%";
    }

    var map2 = L.map('map_right').setView([0, 0], 3);



    var map_element_right = document.getElementById('map_right');

    var observer = new MutationObserver(function (mutations) {
        console.log("updating map right")
        updateMap_right();
    });
    observer.observe(map_element_right, {
        attributes: true,
        attributeFilter: ['data-high-res-src-right']
    });


    function updateMap_right() {
        map2.off();
        map2.remove();
        var img_path_right = $('#map_right').attr('data-high-res-src-right');
        var img_path_right_DAPI = $('#map_right').attr('data-high-res-src-right-DAPI');

        let filter_tomato = [
            'brightness:100%',
            `contrast:${contrastTomato_right}`,
            'grayscale:0%',
            'opacity:50%',
        ];

        let filter_dapi = [
            'brightness:100%',
            `contrast:${contrastDAPI_right}`,
            'grayscale:0%',
            'opacity:50%',
        ];

        var tile_right_tomato = L.tileLayer.colorFilter(img_path_right + '/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 7,
            tms: true,
            crs: L.CRS.Simple,
            noWrap: true,
            maxBoundsViscosity: 1.0,
            filter: filter_tomato
        });

        var tile_right_DAPI = L.tileLayer.colorFilter(img_path_right_DAPI + '/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 7,
            tms: true,
            crs: L.CRS.Simple,
            noWrap: true,
            maxBoundsViscosity: 1.0,
            filter: filter_dapi
        });

        map2 = L.map('map_right', {
            center: [-49, -49],
            zoom: 2,
            layers: [tile_right_DAPI, tile_right_tomato]
        });

        var baseMaps = {

        };

        var overlayMaps = {
            "tdTomato": tile_right_tomato,
            "DAPI": tile_right_DAPI,
        };

        // var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
        var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map2);
        map2.addControl(new L.Control.Fullscreen());

        // annotation.getContainer().classList.add('leaflet-tile');
        // map.on('click', function(e) {
        //     alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
        // });
        resize_right();
    }


    $('#sample_dropdown_right').change(function () {
        scalebar_change_right();
        slyOptions_right['startAt'] = 0;
        pos_mouse_number_right = "";
        neg_mouse_number_right = "";
        update_filter_right(0);
        $("#gene_dropdown_right").val($("#gene_dropdown_right option:eq(0)").val());
        $("#organ_dropdown_right").val($("#organ_dropdown_right option:eq(0)").val());
        $("#experiment_dropdown_right").val($("#experiment_dropdown_right option:eq(0)").val());
        updateSpecimen_right();
    });

    $('#gene_dropdown_right').change(function () {
        slyOptions_right['startAt'] = 0;
        pos_mouse_number_right = "";
        neg_mouse_number_right = "";
        update_filter_right(1);
        updateSpecimen_right();
    });

    $('#organ_dropdown_right').change(function () {
        slyOptions_right['startAt'] = 0;
        pos_mouse_number_right = "";
        neg_mouse_number_right = "";
        update_filter_right(2);
        updateSpecimen_right();
    });

    $('#experiment_dropdown_right').change(function () {
        slyOptions_right['startAt'] = 0;
        pos_mouse_number_right = "";
        neg_mouse_number_right = "";
        update_filter_right(3);
        updateSpecimen_right();
    });


    $("#specimen_above_right").on('click', '.btn', function (event) {
        slyOptions_right['startAt'] = 0;
        pos_mouse_number_right = $(this).find('input').val();
        updateAreaC_right();
    });

    $(".current_id_right").change(function () {
        console.log("changed id right");
        if ($('.current_id_right').val() > parseInt($('.total_result_right').text())) {
            $('.current_id_right').val(parseInt($('.total_result_right').text()));
        }
        var current = parseInt($('.current_id_right').val()) - 1;
        slyOptions_right['startAt'] = current;
        updateAreaC_right();
    });

    $(".clear_filter_right").on('click', function (event) {
        no_result_right();
        selected_slice_right = 0;
        total_result_right = 0;
        pos_DAPI_list_right = [];
        pos_tomato_list_right = [];
        neg_DAPI_list_right = [];
        neg_tomato_list_right = [];
        $("#sample_dropdown_right").val($("#sample_dropdown_right option:eq(0)").val());
        $("#gene_dropdown_right").val($("#gene_dropdown_right option:eq(0)").val());
        $("#organ_dropdown_right").val($("#organ_dropdown_right option:eq(0)").val());
        $("#experiment_dropdown_right").val($("#experiment_dropdown_right option:eq(0)").val());
        update_filter_right(0);
        updateSpecimen_right();
    });



    $("#wavelength-right .btn").on('click', function (event) {
        wavelength = $(this).find('input').val();
        var current = parseInt($('.current_id-right').val()) - 1;
        slyOptions_right['startAt'] = current;
        updateAreaC_right();
    });

    function setDefaultDDlVal(s1, s2, s3, s4) {
        if ($('#sample_dropdown_right').val().length === 0) {
            $("#sample_dropdown_right").val($("#sample_dropdown_right option:eq(1)").val());
            update_filter_right(s1);
            updateSpecimen_right();
        }
    }

    function show_table_right() {
        $(".loader_right").hide();
        $('.no_result_right').hide();
        $('.image_table_right').show();
    }

    function show_loader_right() {
        $('.image_table_right').hide();
        $('.no_result_right').hide();
        $(".loader_right").show();
    }

    function no_result_right() {
        $('.no_result_right').show();
        $(".loader_right").hide();
        $('.image_table_right').hide();
        $('.slice_details_right').hide();
        $('.current_id_right').val(0);
        $('.clearfix_right').html("");
        $('#wavelength_right').hide();
    }

    function show_result_right() {
        $('.no_result_right').hide();
        $('.slice_details_right').show();
        $('.image_table_right').show();
        $('#wavelength_right').show();
        $('#control_right').show();
        $('#sex_right').show();
        show_table_right();
    }

    function scalebar_change_right() {
        if ($('#sample_dropdown_right').val().toLowerCase() === "cleared") {
            $('#img_histological').hide();
            $('#img_cleared2').show();
        } else {
            $('#img_cleared2').hide();
            $('#img_histological2').show();
        }
    }

    function update_filter_right(selected) {
        show_loader_right();
        var url = "/filters?";

        if ($('#sample_dropdown_right').val().length > 0) {
            url += "&instrument=" + $('#sample_dropdown_right').val();
            $('#sample_dropdown_right').css('color', 'black');
        } else {
            $('#sample_dropdown_right').css('color', 'red');
        }

        if (selected >= 1 && $('#gene_dropdown_right').val().length > 0) {
            url += "&gene=" + $('#gene_dropdown_right').val();
        }
        if ($('#gene_dropdown_right').val().length > 0) {
            $('#gene_dropdown_right').css('color', 'black');
        } else {
            $('#gene_dropdown_right').css('color', 'red');
        }

        if (selected >= 2 && $('#organ_dropdown_right').val().length > 0) {
            url += "&organ=" + $('#organ_dropdown_right').val();
        }
        if ($('#organ_dropdown_right').val().length > 0) {
            $('#organ_dropdown_right').css('color', 'black');
        } else {
            $('#organ_dropdown_right').css('color', 'red');
        }

        if (selected >= 3 && $('#experiment_dropdown_right').val().length > 0) {
            url += "&experiment=" + $('#experiment_dropdown_right').val();
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
                    if ($('#gene_dropdown_right').val() != "" && item == $('#gene_dropdown_right').val()) {
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
                    if ($('#organ_dropdown_right').val() != "" && item == $('#organ_dropdown_right').val()) {
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
                    if ($('#experiment_dropdown_right').val() != "" && item == $('#experiment_dropdown_right').val()) {
                        experiments += "<option value='" + item + "' selected>";
                        experiments += item + "</option>";
                    } else {
                        experiments += "<option value='" + item + "'>" + item + "</option>";
                    }
                });
            }

            if (selected == 0) {
                $('#gene_dropdown_right').html(genes);
                $('#organ_dropdown_right').html(organs);
                $('#experiment_dropdown_right').html(experiments);
            }
            if (selected == 1) {
                $('#organ_dropdown_right').html(organs);
                $('#experiment_dropdown_right').html(experiments);
            }
            if (selected == 2) {
                $('#experiment_dropdown_right').html(experiments);
            }

            if (selected == -1) {
                $('#experiment_dropdown_right').html(experiments);
            }

        });

    }

    function check_mandatory_ddl_right() {
        var selects = 0;
        if ($('#sample_dropdown_right').val().length > 0) {
            selects++;
            $('#sample_dropdown_right').css('color', 'black');
        } else {
            $('#sample_dropdown_right').css('color', 'red');
        }

        if ($('#gene_dropdown_right').val().length > 0) {
            selects++;
            $('#gene_dropdown_right').css('color', 'black');
        } else {
            $('#gene_dropdown_right').css('color', 'red');
        }

        if ($('#organ_dropdown_right').val().length > 0) {
            selects++;
            $('#organ_dropdown_right').css('color', 'black');
        } else {
            $('#organ_dropdown_right').css('color', 'red');
        }

        return selects;
    }

    function updateAreaA_right(index) {
        console.log("updateareaa right");
        if (index != -1) {
            if (total_result_right == 0) {
                $('.current_id_right').val(0);
            } else {
                $('.current_id_right').val(index + 1);
            }
            const element = document.getElementById("map_right");

            switch (wavelength_right) {
                case 'tdTomato':
                    element.setAttribute('src', pos_tomato_list_right[index] + ".webp");
                    break;
                case 'DAPI':
                    element.setAttribute('src', pos_DAPI_list_right[index] + ".webp");
                    break;
            }

            element.setAttribute('data-high-res-src-right', pos_tomato_list_right[index]);
            element.setAttribute('data-high-res-src-right-DAPI', pos_DAPI_list_right[index]);
            var id = $('._' + index + "-right").attr('id');
            show_result_right();
            updateSliceDetail_right(id);
        }
    }

    function loadLayers_right(toLoad, list) {

        console.log("toLoad- right: " + toLoad);

        var area_a_url_right = "/slices?per_page=-1&order_by=slice_id";
        if ($('#gene_dropdown_right').val().length > 0) {
            area_a_url_right += "&gene=" + $('#gene_dropdown_right').val();
        }
        if ($('#organ_dropdown_right').val().length > 0) {
            area_a_url_right += "&organ=" + $('#organ_dropdown_right').val();
        }
        if ($('#experiment_dropdown_right').val().length > 0) {
            area_a_url_right += "&experiment=" + $('#experiment_dropdown_right').val();
        }
        if ($('#sample_dropdown_right').val().length > 0) {
            area_a_url_right += "&instrument=" + $('#sample_dropdown_right').val();
        }

        area_a_url_right += "&wavelength=" + toLoad;
        if (control_right == "negative") {
            if (sex_right == 'false') {
                area_a_url_right += "&mouse_number=" + neg_mouse_number_right;
            }
            else {
                area_a_url_right += "&mouse_number=" + neg_mouse_number_right_female;
            }
        }
        else {
            if (sex_right == 'false') {
                area_a_url_right += "&mouse_number=" + pos_mouse_number_right;
            }
            else {
                area_a_url_right += "&mouse_number=" + pos_mouse_number_right_female;
            }
        }

        console.log("area_a_url_right: " + area_a_url_right);

        $.ajax({
            url: area_a_url_right,
            type: 'GET',
            "dataType": "json",
            "dataSrc": "items",
            success: function (data) {
                for (var i in data.items) {
                    list.push(data.items[i].img_no_ext);
                }
            }
        });
    }


    function updateAreaC_right() {
        if (check_mandatory_ddl_right() === 3) {
            console.log("update area c right")
            var area_a_url = "/slices?per_page=-1&order_by=slice_id";

            if ($('#gene_dropdown_right').val().length > 0) {
                area_a_url += "&gene=" + $('#gene_dropdown_right').val();
            }
            if ($('#organ_dropdown_right').val().length > 0) {
                area_a_url += "&organ=" + $('#organ_dropdown_right').val();
            }
            if ($('#experiment_dropdown_right').val().length > 0) {
                area_a_url += "&experiment=" + $('#experiment_dropdown_right').val();
            }
            if ($('#sample_dropdown_right').val().length > 0) {
                area_a_url += "&instrument=" + $('#sample_dropdown_right').val();
            }

            if (wavelength_right == "tdTomato-RI") {
                area_a_url += "&wavelength=tdTomato";
            } else {
                area_a_url += "&wavelength=" + wavelength_right;
            }

            if (control_right === "negative") {
                if (sex_right == 'false') {
                    area_a_url += "&mouse_number=" + neg_mouse_number_right;
                }
                else {
                    area_a_url += "&mouse_number=" + neg_mouse_number_right_female;
                }
            }
            else {
                if (sex_right === 'false') {
                    area_a_url += "&mouse_number=" + pos_mouse_number_right;
                }
                else {
                    area_a_url += "&mouse_number=" + pos_mouse_number_right_female;
                }
            }

            console.log("area_a_url_right: " + area_a_url);


            $.ajax({
                url: area_a_url,
                type: 'GET',
                "dataType": 'json',
                "dataSrc": "items",
                success: function (data) {
                    console.log(data);
                    var content = "";
                    total_result_right = 0;
                    for (var i in data.items) {
                        total_result_right++;
                        content += "<li class='_" + i + "' id='" + data.items[i].id + "-right'><img src='";
                        if (wavelength_right === "tdTomato-RI") {
                            content += data.items[i].img_small_RI;
                        } else {
                            content += data.items[i].img_small;
                        }
                        content += "' width='180px' ></li>";
                    }


                    updateAreaA_right(itemIndex_right);


                    $('.total_result_right').html(total_result_right);
                    $('.current_id_right').attr("max", total_result_right);
                    $('.current_id_right').attr("min", 1);
                    if (content.length === 0) {
                        $('.clearfix_right').html("<li>N/A</li>");
                    } else {
                        $('.clearfix_right').html(content);
                    }

                    $frame_right.sly(false);
                    $frame_right.sly(slyOptions_right);
                    $frame_right.sly('on', 'active', function (eventName, itemIndex_right) {
                        console.log("slice clicked");
                        updateAreaA_right(itemIndex_right);
                    });
                }, error: function (jqXHR, status, err) {

                }
            });
        }
    }

    function updateSliceDetail_right(id) {
        console.log("updateSliceDetail_right");
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
                    content += "<p>Shareable URL: <button class='glyphicon glyphicon-copy copyUrl_right btn btn-info' ";
                    content += " title='click here to copy Shareable URL'></button></p>";
                    content += "<div id='url' style='display:none;'>https://amis.docking.org/img_browser";
                    content += "?";
                    if ($('#gene_dropdown_right').val().length > 0) {
                        content += "gene=" + $('#gene_dropdown_right').val();
                    }
                    if ($('#organ_dropdown_right').val().length > 0) {
                        content += "&organ=" + $('#organ_dropdown_right').val();
                    }
                    if ($('#experiment_dropdown_right').val().length > 0) {
                        content += "&experiment=" + $('#experiment_dropdown_right').val();
                    }
                    if ($('#sample_dropdown_right').val().length > 0) {
                        content += "&instrument=" + $('#sample_dropdown_right').val();
                    }
                    content += "<br/>&wavelength=" + wavelength_right;

                    if (control_right === "positive") {
                        if (sex_right === "false") {
                            content += "&mouse_number=" + pos_mouse_number_right;
                        }
                        else {
                            content += "&mouse_number=" + pos_mouse_number_right_female;
                        }
                    }
                    else {
                        if (sex_right === "false") {
                            content += "&mouse_number=" + neg_mouse_number_right;
                        }
                        else {
                            content += "&mouse_number=" + neg_mouse_number_right_female;
                        }
                    }

                    content += "&selected_slice=" + $('.current_id_right').val() + "</div>";
                }
                $('.slice_details_right').html(content);
            }, error: function (jqXHR, status, err) {
                $('.alert-danger .text').text(err.toLowerCase() + '!');
                $('.alert-danger').show();
            }
        });
    }

    function updateSpecimen_right() {
        if (check_mandatory_ddl_right() < 3) {
            console.log("updateSpecimen right");
            no_result_right();
        } else {
            let uri = "/mice?";
            if ($('#gene_dropdown_right').val().length > 0) {
                uri += "&gene=" + $('#gene_dropdown_right').val();
            }
            if ($('#organ_dropdown_right').val().length > 0) {
                uri += "&organ=" + $('#organ_dropdown_right').val();
            }
            if ($('#experiment_dropdown_right').val().length > 0) {
                uri += "&experiment=" + $('#experiment_dropdown_right').val();
            }
            if ($('#sample_dropdown_right').val().length > 0) {
                uri += "&instrument=" + $('#sample_dropdown_right').val();
            }

            console.log(uri);
            $.ajax({
                type: 'GET',
                url: uri,
                "dataType": "json",
                "dataSrc": "items",
                success: function (data) {
                    var content_above = "";
                    var content_below = "";

                    data.items.sort(compareValues('number', 'asc'));
                    data.items.sort(compareValues('sex', 'asc'));
                    data.items.sort(compareValues('spec', 'asc'));


                    for (var i in data.items) {
                        if (data.items[i].spec === '+') {
                            if (data.items[i].sex) {
                                pos_mouse_number_right_female = data.items[i].number;
                            }
                            else {
                                pos_mouse_number_right = data.items[i].number;
                            }
                        }
                        if (data.items[i].spec === '-') {
                            if (data.items[i].sex) {
                                neg_mouse_number_right_female = data.items[i].number;
                            }
                            else {
                                neg_mouse_number_right = data.items[i].number;
                            }
                        }
                    }
                    reloadMap_right();


                }, error: function (jqXHR, status, err) {
                    $('.alert-danger .text').text(err.toLowerCase() + '!');
                    $('.alert-danger').show();
                }
            });
        }
    }


    function reloadMap_right() {
        pos_tomato_list_right = [];
        pos_DAPI_list_right = [];
        loadLayers_right("DAPI", pos_DAPI_list_right);
        loadLayers_right("tdTomato", pos_tomato_list_right);

        updateAreaC_right();
        updateMap_right();
    }
    $("#wavelength_right .btn").on('click', function (event) {
        console.log("wavelength right");
        wavelength_right = $(this).find('input').val();
        itemIndex_right = parseInt($('.current_id_right').val()) - 1;
        slyOptions_right['startAt'] = itemIndex_right;
        reloadMap_right();

    });

    $("#control_right .btn").on('click', function (event) {
        console.log("changing control_right");
        control_right = $(this).find('input').val();
        itemIndex_right = parseInt($('.current_id_right').val()) - 1;
        slyOptions_right['startAt'] = itemIndex_right;
        reloadMap_right();
    });

    $("#sex_right .btn").on('click', function (event) {
        console.log("changing sex right");
        sex_right = $(this).find('input').val();
        itemIndex_right = parseInt($('.current_id_right').val()) - 1;
        slyOptions_right['startAt'] = itemIndex_right;
        reloadMap_right();
    });



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
});
