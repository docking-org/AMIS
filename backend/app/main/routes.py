from flask import render_template, request, send_file, make_response, jsonify, current_app, send_from_directory
import json
import cv2
import json
import urllib
import os
import numpy as np
from app.data.lut.lookuptables import lookuptables
from app.main import application
from app.helpers.validation import load_images
from app.data.models.slice import SliceModel
from app.data.models.gene import GeneModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.organ import OrganModel
from app.data.models.experiment import ExperimentModel
from app.data.models.feedback import FeedbackModel
from app.data.models.display_options import DisplayOptionsModel
from app import db

# @application.route('/', methods=['GET'])
# def index(gene_name=None, organ_name=None):
#     gene = request.args.get("gene")
#     organ = request.args.get("organ")
#     genes = GeneNameModel.find_all()
#     organs = OrganModel.find_all()
#     return render_template('index.html', genes=genes, organs=organs, gene_name=gene, organ_name=organ)


@application.route('/slice', methods=['GET'])
def get_slice():
    return render_template('slice.html')


@application.route('/gene', methods=['GET'])
def gene():
    return render_template('gene.html')




@application.route('/organ', methods=['GET'])
def organ():
    return render_template('organ.html')


@application.route('/experiment', methods=['GET'])
def experiment():
    return render_template('experiment.html')


@application.route('/mouse', methods=['GET'])
def mouse():
    return render_template('mouse.html')



@application.route('/interest', methods=['GET'])
def interest():
    genes = GeneModel.find_unique_names()
    organs = OrganModel.find_all()
    return render_template('interest.html', genes=genes, organs=organs)


# @application.route('/upload/<type>', methods=['GET', 'POST'])
# def upload_file(type):
#     if request.method == 'POST':
#         folder = current_app.config['FILE_UPLOAD_FOLDER']
#         file = request.files['file']
#         file_dir = os.path.realpath(os.path.dirname(folder))
#         pathlib.Path(file_dir).mkdir(parents=True, exist_ok=True)
#         file.stream.seek(0)
#         filename = file_dir + "/test.csv"
#         if os.path.exists(filename):
#             os.remove(filename)
#         file.save(os.path.join(filename))
#
#         records = pe.iget_records(file_name=filename)
#         save_excel_records(type, records, pe)
#         pe.free_resources()
#
#         print("print post")
#         return "Successfully uploaded!\n"
#     else:
#         print("print get")
#         return "GET"

@application.route('/loadimages/<path>/<folder>', methods=['GET', 'POST'])
def image_load(path = None, folder = None):
    # folder = current_app.config['IMAGE_LOAD_FOLDER']
    # file_dir = os.path.realpath(os.path.dirname(folder))
    # lst = os.listdir(file_dir)
    # ret = save_file_list(lst)
    if path and folder:
        url = current_app.config['URL_MAP'][path] + "/" + folder
        print(url)
        return load_images(url)
    else:
        return make_response(jsonify({'error': 'Could not download image'}), 400)

@application.route('/details/<id>/<from_url>', methods=['GET', 'POST'])
def details(id, from_url):
    slice = SliceModel.find_by_id(id)
    return render_template('details.html', slice=slice, from_url=from_url)


@application.route('/img_browser', methods=['GET', 'POST'])
def img_browser():
    gene = request.args.get("gene")
    organ = request.args.get("organ")
    experiment = request.args.get("experiment")
    sample_type = request.args.get("instrument")
    pos_mouse_number = request.args.get("pos_mouse_number")
    neg_mouse_number = request.args.get("neg_mouse_number")
    wavelength = request.args.get("wavelength")
    imgType = request.args.get("imgType")
    selected_slice = request.args.get("selected_slice")
    genes = GeneModel.find_unique_names()
    organs = OrganModel.find_all()
    experiments = ExperimentModel.find_all()
    genes = [i.to_dict() for i in genes]
    experiments = [i.to_dict() for i in experiments]
    organs = [i.to_dict() for i in organs]
    
    # return a json  of 
    return  jsonify({'genes': genes, "organs": organs, "experiments":experiments})

@application.route('/getAutoValues', methods=['GET'])
def getAutoValues(clip_hist_percent=2):
    return jsonify({'min': int(0), "max": int(img.max()), "contrast":str(3), "brightness": str(3)})


@application.route('/lut/<z>/<x>/<y>', methods=['GET'])
def lut(z,x,y):
    ycord = y.split(".")[0]
    if int(z) < 0 or int(x) < 0 or int(ycord) < 0:
        return make_response(jsonify({'error': 'Invalid coordinates'}), 400)
    lut = request.args.get("lut")
    url = toPath(request.args.get('url'))
 
    url = url + "/{}/{}/{}".format(z,x,y)
    
    autobrightness = request.args.get("autobrightness")
    
    img = cv2.imread(url, cv2.COLOR_BGR2GRAY)
    

    # # opacityThreshold = float(request.args.get("opacityThreshold"))* 65535 / 100
    
    if img is not None:
   
        # base_img = '/'.join(url.split("/")[0:6]) + ".png"
    
        # im = cv2.imread(base_img, cv2.COLOR_BGR2GRAY)     
        
        
        # im = cv2.normalize(im, None, -1 +(int(request.args.get("contrast"))*256/100), 255, cv2.NORM_MINMAX, cv2.CV_8U)
        
        # stacked = im
        # #raise min value by int(request.args.get("brightness"))
        
        
        # im_type = stacked.dtype
        # # minimum and maximum of image
        # im_min = np.min(stacked)
        # if int(request.args.get("brightness")) < 0:
        #     stacked = stacked - (int(request.args.get("brightness"))*256/100)
        #     im_max = np.max(stacked)

        # else:
        #     im_max = np.max(stacked)-(int(request.args.get("brightness"))*256/100)
       
        # hist_min = im_min
        # hist_max = im_max
        
        # # compute histogram
        # if hist_min >= hist_max:
        #     hist_min = hist_max - 1
        # histogram = np.histogram(stacked, bins=256, range=(hist_min, hist_max))[0]
        # bin_size = (hist_max - hist_min)/256

        # # compute output min and max bins =================================================================================

        # # various algorithm parameters
        # h, w = stacked.shape[:2]
        # pixel_count = h * w
        # # the following values are taken directly from the ImageJ file.
        # limit = pixel_count/10
        # const_auto_threshold = 5000
        # auto_threshold = 0

        # auto_threshold = const_auto_threshold if auto_threshold <= 10 else auto_threshold/2
        # threshold = int(pixel_count/auto_threshold)

        # # setting the output min bin
        # i = -1
        # found = False
        # # going through all bins of the histogram in increasing order until you reach one where the count if more than
        # # pixel_count/auto_threshold
        # while not found and i <= 254:
        #     i += 1
        #     count = histogram[i]
        #     if count > limit:
        #         count = 0
        #     found = count > threshold
        # hmin = i
        # found = False

        # # setting the output max bin : same thing but starting from the highest bin.
        # i = 256
        # while not found and i > 0:
        #     i -= 1
        #     count = histogram[i]
        #     if count > limit:
        #         count = 0
        #     found = count > threshold
        # hmax = i

        # # compute output min and max pixel values from output min and max bins ===============================================
        # if hmax >= hmin:
        #     min_ = hist_min + hmin * bin_size
        #     max_ = hist_min + hmax * bin_size
        #     # bad case number one, just return the min and max of the histogram
        #     if min_ == max_:
        #         min_ = hist_min
        #         max_ = hist_max
        # # bad case number two, same
        # else:
        #     min_ = hist_min
        #     max_ = hist_max

        # # apply the contrast, relative to img   
        check = url.split(".")[0].split("_")[-1].split("/")[0]
        slice = SliceModel.query.filter_by(checksum=check).first()
        display_options = DisplayOptionsModel.query.filter_by(slice_fk=slice.id).first()
    
        if display_options:
            img = (img-display_options.contrast_min)/(display_options.contrast_max-display_options.contrast_min) * 255
    
        if lut == "inverted":
            img = cv2.bitwise_not(img)
        elif lut == "grayscale":
            pass
        else: 
            try:
                img = img.astype(np.uint8)
                max = np.max(img)
                img[img >= max] = 0
                img = cv2.LUT(img, lookuptables[lut])
            except Exception as e:
                print(e)
                pass
        
        #this does contrast
        min = np.min(img)
        max = np.max(img)
        contrast = int(request.args.get("contrast"))/100 * 256
        brightness = int(request.args.get("brightness"))/100 * 256
        print(brightness)
        #add brightnes to each pixel, except for the max value
        img = img + brightness
        img[img !=min ] = img[img !=min] - contrast
        
        retval, buffer = cv2.imencode('.png', img)
        response = make_response(buffer.tobytes())
        response.headers.set('Content-Type', 'image/png')
        response.headers.set(
            'Content-Disposition', 'attachment')
        return response
    else:
        return make_response(jsonify({'error': 'Could not download image'}), 400)

@application.route('/images/<path>/<number>/<image>/<x>/<y>/<z>.png', methods=['GET'])
def send_slice(path,number,image, x, y, z):
    if path not in current_app.config['URL_MAP']:
        return make_response(jsonify({'error': 'Invalid path'}), 400)
    else:
        url = current_app.config['URL_MAP'][path] + "/" + number + "/" + image + "/" + x + "/" + y + "/"
        
        #convert from 0 based to 1 based
        
        return send_from_directory(url, '0.png')
    
@application.route('/images/<path>/<number>/<image>', methods=['GET'])
def send_image(path,number,image):
    # if image.split(".")[1] == "webp" and not os.path.exists(current_app.config['URL_MAP'][path] + "/" + number + "/" + image):
    #     image = image.split(".")[0] + ".png"
    
        
    if path not in current_app.config['URL_MAP']:
        return make_response(jsonify({'error': 'Invalid path'}), 400)
    else:
        
        url = current_app.config['URL_MAP'][path] + "/" + number

        if not os.path.exists(url + "/" + image):
            for path in current_app.config['URL_MAP']:
                if os.path.exists(current_app.config['URL_MAP'][path] + "/" + number + "/" + image):
                    url = current_app.config['URL_MAP'][path] + "/" + number
                    break
        
        if image.split(".")[1] == "webp":
            img = cv2.imread(url + "/" + image.replace(".webp", ".png"), cv2.IMREAD_UNCHANGED)
            stacked = img

            im_type = stacked.dtype
            # minimum and maximum of image
            im_min = np.min(stacked)
            im_max = np.max(stacked)

            if im_type == np.uint8:
                hist_min = 0
                hist_max = 256
            elif im_type in (np.uint16, np.int32):
                hist_min = im_min
                hist_max = im_max
            else:
                raise NotImplementedError(f"Not implemented for dtype {im_type}")

            # compute histogram
            histogram = np.histogram(stacked, bins=256, range=(hist_min, hist_max))[0]
            bin_size = (hist_max - hist_min)/256

            # compute output min and max bins =================================================================================

            # various algorithm parameters
            h, w = stacked.shape[:2]
            pixel_count = h * w
            # the following values are taken directly from the ImageJ file.
            limit = pixel_count/10
            const_auto_threshold = 5000
            auto_threshold = 0

            auto_threshold = const_auto_threshold if auto_threshold <= 10 else auto_threshold/2
            threshold = int(pixel_count/auto_threshold)

            # setting the output min bin
            i = -1
            found = False
            # going through all bins of the histogram in increasing order until you reach one where the count if more than
            # pixel_count/auto_threshold
            while not found and i <= 255:
                i += 1
                count = histogram[i]
                if count > limit:
                    count = 0
                found = count > threshold
            hmin = i
            found = False

            # setting the output max bin : same thing but starting from the highest bin.
            i = 256
            while not found and i > 0:
                i -= 1
                count = histogram[i]
                if count > limit:
                    count = 0
                found = count > threshold
            hmax = i

            # compute output min and max pixel values from output min and max bins ===============================================
            if hmax >= hmin:
                min_ = hist_min + hmin * bin_size
                max_ = hist_min + hmax * bin_size
                # bad case number one, just return the min and max of the histogram
                if min_ == max_:
                    min_ = hist_min
                    max_ = hist_max
            # bad case number two, same
            else:
                min_ = hist_min
                max_ = hist_max


            # apply the contrast, relative to img
            old_max = np.max(img)
            img = (img-min_)/(max_-min_) * 255
            new_max = np.max(img)
            
            #get adjusted contrast value
            contrast = (max_-min_)
            print(contrast)
            #gett adjusted brightness value
            print(old_max, new_max)
            brightness = (old_max - new_max)
            print(brightness)

            # if not os.path.exists(url + "/" + image.split(".")[0] + ".webp"):
            checksum = image.split(".")[0].split("_")[-1]
            slice = SliceModel.query.filter_by(checksum=checksum).first()
            display_options = DisplayOptionsModel.query.filter_by(slice_fk=slice.id).first()
            if display_options:
                display_options.min = min_/256
                display_options.max = max_/256
                display_options.brightness = brightness
                display_options.contrast_min = min_/256
                display_options.contrast_max = max_/256
            else:
                new_options = DisplayOptionsModel(slice_fk=slice.id, min=min_/256, max=max_/256, brightness=brightness, contrast_min=min_/256, contrast_max=max_/256)
                db.session.add(new_options)
            db.session.commit()

            cv2.imwrite(url + "/" + image.split(".")[0] + ".webp", img)
            return send_from_directory(url, image.split(".")[0] + ".webp")
        else:
            print(url, image)
            return send_from_directory(url, image)
        


       
    
def toPath(url):
    path = url.split("/")[2]
    new = current_app.config['URL_MAP'][path] 
    path = url.replace("/images/" + path, new)
    return path
        

@application.route('/submitFeedback', methods=['POST'])
def submitFeedback():

    data = request.get_json()
    
    feedback = data["feedback"]
    contact_info = data["contactInfo"]
    
    if feedback == "":
        return make_response(jsonify({'error': 'Feedback cannot be empty'}), 400)
    else:
        fb = FeedbackModel(feedback=feedback, contact_info=contact_info)
        db.session.add(fb)
        db.session.commit()
        return make_response(jsonify({'success': 'Feedback submitted'}), 200)
        

