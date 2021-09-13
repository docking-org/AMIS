jQuery(function ($) {
    'use strict';


    var img_color = 1;
    var bg_color = 1;
    var total_result = 0;
    var pos_DAPI_list = [];
    var pos_tomato_list = [];
    var neg_DAPI_list = [];
    var neg_tomato_list = [];
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
        scrollBar: $wrap.find('.scrollbar'),
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


    $('#sample_dropdown').change(function () {
        scalebar_change();
        slyOptions['startAt'] = 0;
        pos_mouse_number = "";
        neg_mouse_number = "";
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
        updateFilter(1);
        updateSpecimen();
    });

    $('#organ_dropdown').change(function () {
        slyOptions['startAt'] = 0;
        pos_mouse_number = "";
        neg_mouse_number = "";
        updateFilter(2);
        updateSpecimen();
    });

    $('#experiment_dropdown').change(function () {
        slyOptions['startAt'] = 0;
        pos_mouse_number = "";
        neg_mouse_number = "";
        updateFilter(3);
        updateSpecimen();
    });


    $("#specimen_above").on('click', '.btn', function (event) {
        slyOptions['startAt'] = 0;
        pos_mouse_number = $(this).find('input').val();
        updateAreaC();
    });

    $(".current_id").change(function () {
        if ($('.current_id').val() > parseInt($('.total_result').text())) {
            $('.current_id').val(parseInt($('.total_result').text()));
        }
        var current = parseInt($('.current_id').val()) - 1;
        slyOptions['startAt'] = current;
        updateAreaC();
    });

    $(".clear_filter").on('click', function (event) {
        no_result();
        $("#sample_dropdown").val($("#sample_dropdown option:eq(0)").val());
        $("#gene_dropdown").val($("#gene_dropdown option:eq(0)").val());
        $("#organ_dropdown").val($("#organ_dropdown option:eq(0)").val());
        $("#experiment_dropdown").val($("#experiment_dropdown option:eq(0)").val());
        updateFilter(0);
        updateSpecimen();
    });

    $("#specimen_below").on('click', '.btn', function (event) {
        slyOptions['startAt'] = 0;
        neg_mouse_number = $(this).find('input').val();

        var area_b_url = "/slices?per_page=-1&order_by=slice_id";
        if ($('#gene_dropdown').val().length > 0) {
            area_b_url += "&gene=" + $('#gene_dropdown').val();
        }
        if ($('#organ_dropdown').val().length > 0) {
            area_b_url += "&organ=" + $('#organ_dropdown').val();
        }
        if ($('#experiment_dropdown').val().length > 0) {
            area_b_url += "&experiment=" + $('#experiment_dropdown').val();
        }
        if ($('#sample_dropdown').val().length > 0) {
            area_b_url += "&instrument=" + $('#sample_dropdown').val();
        }
        if (neg_mouse_number != "") {
            area_b_url += "&mouse_number=" + neg_mouse_number;
        }
        fillAreaBImageArrays(area_b_url);
    });

    $("#wavelength .btn").on('click', function (event) {
        wavelength = $(this).find('input').val();
        var current = parseInt($('.current_id').val()) - 1;
        slyOptions['startAt'] = current;
        updateAreaC();
    });

    function setDefaultDDlVal(s1, s2, s3, s4) {
        if ($('#sample_dropdown').val().length == 0) {
            $("#sample_dropdown").val($("#sample_dropdown option:eq(1)").val());
            updateFilter(s1);
            updateSpecimen();
        }
    }

    function show_table() {
        $(".loader").hide();
        $('.no_result').hide();
        $('.image_table').show();
    }

    function show_loader() {
        $('.image_table').hide();
        $('.no_result').hide();
        $(".loader").show();
    }

    function no_result() {
        $('.no_result').show();
        $(".loader").hide();
        $('.image_table').hide();
        $('.slice_details').hide();
        $('.current_id').val(0);
        $('.clearfix').html("");
        $('#wavelength').hide();
    }

    function show_result() {
        $('.no_result').hide();
        $('.slice_details').show();
        $('.image_table').show();
        $('#wavelength').show();
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
        if (index == -1) {

        } else {
            if (total_result == 0) {
                $('.current_id').val(0);
            } else {
                $('.current_id').val(index + 1);
            }
            show_result();

            $('.selected_slice2').attr('src', pos_tomato_list[index] + "_RI.webp");
            $('.selected_slice2').attr('data-high-res-src', pos_tomato_list[index] + "_RI");

            $('.selected_slice1').attr('src', pos_tomato_list[index] + ".webp");
            $('.selected_slice1').attr('data-high-res-src', pos_tomato_list[index]);

            $('.selected_slice3').attr('src', pos_DAPI_list[index] + ".webp");
            $('.selected_slice3').attr('data-high-res-src', pos_DAPI_list[index]);

            var id = $('._' + index).attr('id');
            updateSliceDetail(id);
        }
    }

    function updateAreaB(index) {
        if (index == -1) {

        } else {
            if (index + 1 > neg_tomato_list.length) {
                $('.area_B img').css('cursor', 'auto');
                $('.selected_slice4').attr('src', "/static/images/na.png");
                $('.selected_slice4').attr('data-high-res-src', "");
                $('.selected_slice5').attr('src', "/static/images/na.png");
                $('.selected_slice5').attr('data-high-res-src', "");
                $('.selected_slice6').attr('src', "/static/images/na.png");
                $('.selected_slice6').attr('data-high-res-src', "");
            } else {
                $('.area_B img').css('cursor', 'zoom-in');
                $('.selected_slice4').attr('src', neg_tomato_list[index] + ".webp");
                $('.selected_slice4').attr('data-high-res-src', neg_tomato_list[index]);
                $('.selected_slice5').attr('src', neg_tomato_list[index] + "_RI.webp");
                $('.selected_slice5').attr('data-high-res-src', neg_tomato_list[index] + "_RI");
                $('.selected_slice6').attr('src', neg_DAPI_list[index] + ".webp");
                $('.selected_slice6').attr('data-high-res-src', neg_DAPI_list[index]);
            }
        }
    }

    function updateAreaC() {
        var area_a_url = "/slices?per_page=-1&order_by=slice_id";
        var area_b_url;
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
        if (neg_mouse_number != "") {
            area_b_url = area_a_url + "&mouse_number=" + neg_mouse_number;
        }
        if (wavelength == "tdTomato-RI") {
            area_a_url += "&wavelength=tdTomato";
        } else {
            area_a_url += "&wavelength=" + wavelength;
        }
        if (pos_mouse_number != "") {
            area_a_url += "&mouse_number=" + pos_mouse_number;
        }

        pos_tomato_list = [];
        pos_DAPI_list = [];
        $.ajax({
            type: 'GET',
            url: area_a_url,
            "dataType": "json",
            "dataSrc": "items",
            success: function (data) {
                var content = "";
                total_result = 0;
                for (var i in data.items) {
                    total_result++;
                    content += "<li class='_" + i + "' id='" + data.items[i].id + "'><img src='";
                    if (wavelength == "tdTomato-RI") {
                        content += data.items[i].img_small_RI;
                    } else {
                        content += data.items[i].img_small;
                    }
                    content += "' width='180px' ></li>";
                    if (wavelength == "DAPI") {
                        pos_DAPI_list.push(data.items[i].img_no_ext);
                    } else {
                        pos_tomato_list.push(data.items[i].img_no_ext);
                    }
                }

                if (img_color == 1) {
                    img_color = 2;
                } else {
                    img_color = 1;
                }
                changeFilter();
                if (content.length > 0) {
                    if (wavelength == "DAPI") {
                        area_a_url = area_a_url.replace('wavelength=DAPI', 'wavelength=tdTomato');
                    } else {
                        area_a_url = area_a_url.replace('wavelength=tdTomato', 'wavelength=DAPI')
                    }
                    fillAreaAImageArrays(area_a_url);
                    fillAreaBImageArrays(area_b_url);
                    $('#wavelength').show();
                } else {
                    updateAreaA(-1);
                }

                $('.total_result').html(total_result);
                $('.current_id').attr("max", total_result);
                $('.current_id').attr("min", 1);
                if (content.length == 0) {
                    $('.clearfix').html("<li>N/A</li>");
                } else {
                    $('.clearfix').html(content);
                }

                $frame.sly(false);
                $frame.sly(slyOptions);
                $frame.sly('on', 'active', function (eventName, itemIndex) {
                    updateAreaA(itemIndex);
                    updateAreaB(itemIndex);
                });
            }, error: function (jqXHR, status, err) {

            }
        });
    }


    function fillAreaAImageArrays(url) {
        $.ajax({
            type: 'GET',
            url: url,
            "dataType": "json",
            "dataSrc": "items",
            success: function (data) {
                for (var i in data.items) {
                    if (wavelength != "DAPI") {
                        pos_DAPI_list.push(data.items[i].img_no_ext);
                    } else {
                        pos_tomato_list.push(data.items[i].img_no_ext);
                    }
                }
                updateAreaA(slyOptions['startAt']);
                updateAreaB(slyOptions['startAt']);
            }, error: function (jqXHR, status, err) {

            }
        });
    }

    function fillAreaBImageArrays(url) {
        neg_tomato_list = [];
        neg_DAPI_list = [];
        $.ajax({
            type: 'GET',
            url: url,
            "dataType": "json",
            "dataSrc": "items",
            success: function (data) {
                for (var i in data.items) {
                    if (data.items[i].wavelength == 'DAPI') {
                        neg_DAPI_list.push(data.items[i].img_no_ext);
                    } else {
                        neg_tomato_list.push(data.items[i].img_no_ext);
                    }
                }
                updateAreaB($('.current_id').val() - 1);
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
                    if (pos_mouse_number != "") {
                        content += "&pos_mouse_number=" + pos_mouse_number;
                    }
                    if (neg_mouse_number != "") {
                        content += "&neg_mouse_number=" + neg_mouse_number;
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
        if (check_mandatory_ddl() < 3) {
            console.log("updateSpeciment");
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
                    var content_above = "";
                    var content_below = "";

                    data.items.sort(compareValues('number', 'asc'));
                    data.items.sort(compareValues('sex', 'asc'));
                    data.items.sort(compareValues('spec', 'asc'));

                    for (var i in data.items) {
                        var content = "";
                        content += "<label class='btn btn2 btn-info";
                        if ((pos_mouse_number == data.items[i].number || pos_mouse_number == "") && data.items[i].spec == '+') {
                            pos_mouse_number = data.items[i].number;
                            content += " active";
                        }
                        if ((neg_mouse_number == data.items[i].number || neg_mouse_number == "") && data.items[i].spec == '-') {
                            neg_mouse_number = data.items[i].number;
                            content += " active";
                        }

                        content += "'><input type='radio' name='options' ";
                        content += "value='" + data.items[i].number + "'> ";

                        if (data.items[i].sex) {
                            content += " <i class='fas fa-mars'></i> ";
                        } else {
                            content += " <i class='fas fa-venus'></i> ";
                        }
                        content += data.items[i].age + " " + data.items[i].number + "</label>";
                        if (data.items[i].spec == '+') {
                            content_above += content;
                        } else {
                            content_below += content;
                        }
                    }
                    $('#specimen_above').html(content_above);
                    $('#specimen_below').html(content_below);

                    updateAreaC();
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