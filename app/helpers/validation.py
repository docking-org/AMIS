from app.data.models.genotype import GenotypeModel
from app.data.models.gene import GeneModel
from app.data.models.mouse import MouseModel
from app.data.models.mani_type import ManipulationTypeModel
from app.data.models.organ import OrganModel
from app.data.models.slice import SliceModel
from app.data.models.gene_name import GeneNameModel
from app.data.models.experiment import ExperimentModel
from flask import current_app
import os
from PIL import Image
import glob
from pathlib import Path
import re


def save_excel_records(type, records):
    line = 1
    for record in records:
        pass
        # Upload from file is not working now. If we need this feature, We have to fix below commented codes
        # combined_values = '_'.join('{}'.format(value) for key, value in record.items()).replace(" ", "_")
        # print(combined_values)
        # line += 1
        # # genotype = GenotypeModel.find_by_name(record['genotype'])
        # try:
        #     genotype_gene = GenotypeModel.find_by_id(record['genotype_gene'])
        #     genotype_reporter = GenotypeModel.find_by_id(record['genotype_reporter'])
        #     # print(genotype)
        #     gene = GeneModel(record['gene'], genotype_gene, genotype_reporter)
        #     mani_type = ManipulationTypeModel.find_by_name(record['manipulation_type'])
        #     if mani_type is None:
        #         mani_type = ManipulationTypeModel(record['manipulation_type'])
        #     sex = 1
        #     if record['sex'].upper() == "F":
        #         sex = 0
        #     mouse = MouseModel(record['mouse_number'], sex, record['age'], gene, mani_type)
        #     organ = OrganModel.find_by_name(record['organ'])
        #     if organ is None:
        #         organ = OrganModel(record['organ'])
        #     experiment = ExperimentModel.find_by_name(record['experiment'])
        #     if experiment is None:
        #         experiment = ExperimentModel(record['experiment'])
        #     if type == 'slide':
        #         # self, slide_number, sample_number, slice_id, orientation, location_index, z_step_size,
        #         # resolution, instrument, wavelength, probe_id, survey_classification, checksum, organ,
        #         # mouse, experiment, combined_data):
        #
        #         # uberon, orientation, slide_number, slice_id, objective, instrument,
        #         # wavelength, checksum, organ, mouse, experiment, combined_data
        #         slice = SliceModel(record['slide_number'], None, record['slice_id'], record['orientation'],
        #                            record['location_index'], None, record['objective'], record['instrument'],
        #                            record['wavelength'],
        #                            record['checksum'], organ, mouse, experiment, combined_values)
        #         slice.save_to_db()
        #     elif type == 'cleared':
        #         slice = SliceModel(None, record['sample_number'], record['slice_id'], None, None,
        #                            record['z_step_size'], record['objective'], record['instrument'],
        #                            record['wavelength'], record['probe_id'], record['survey_classification'],
        #                            record['checksum'], organ, mouse, experiment, combined_values)
        #         slice.save_to_db()
        #     else:
        #         return "Please check URL. It must be '/upload/slide' or '/upload/cleared'"
        # except Exception as e:
        #     return "Please check line number: {}\n Exception {}\n".format(line, str(e))


def load_images():
    skipped = 0
    new_files = 0
    p_denied = 0
    folder = current_app.config['IMAGE_LOAD_FOLDER']
    path = os.path.realpath(os.path.dirname(folder))
    print("Path: {}".format(path))
    files = [f for f in glob.glob(path + "/**/*.tif", recursive=True)]
    for file in files:
        file_name = Path(file).stem
        file_name_with_ext = Path(file).name
        file_sub_folder = str(Path(file).parent)[len(path):]
        # print("File: {}".format(file))
        # print("File name: {}".format(file_name))
        # print("File name with extention: {}".format(file_name_with_ext))
        # print("File sub folder: {}".format(file_sub_folder))
        if SliceModel.isRegistered(file_name):
            skipped += 1
            print("_______________Skipped the file: {}".format(file_name_with_ext))
            continue;
        values = file_name.split('_')
        try:
            genotype_gene = GenotypeModel.find_by_id(values[2])
            if genotype_gene is None:
                genotype_gene = GenotypeModel(values[2], None)
                genotype_gene.save_to_db()
            genotype_reporter = GenotypeModel.find_by_id(values[3])
            if genotype_reporter is None:
                genotype_reporter = GenotypeModel(values[3], None)
                genotype_reporter.save_to_db()
            gene_name = GeneNameModel.find_by_name(values[0])
            if gene_name is None:
                gene_name = GeneNameModel(values[0])
                gene_name.save_to_db()
            gene = GeneModel.find_by_gene_name_ids(gene_name, genotype_gene, genotype_reporter)
            if gene is None:
                gene = GeneModel(gene_name, genotype_gene, genotype_reporter)
            experiment = ExperimentModel.find_by_name(values[1])
            if experiment is None:
                experiment = ExperimentModel(values[1])
            mani_type = ManipulationTypeModel.find_by_name(values[7])
            if mani_type is None:
                mani_type = ManipulationTypeModel(values[7])
            sex = 1
            if values[5].lower() == "f" or values[5].lower() == "female":
                sex = 0
            mouse = MouseModel.find_by_number(values[4])
            if mouse is None:
                mouse = MouseModel(values[4], sex, values[6], gene, mani_type)
            organ = OrganModel.find_by_name(values[8])
            if organ is None:
                organ = OrganModel(values[8])
            if len(values) == 17:
                # values.remove('')
                # uberon, orientation, slide_number, slice_id, z_step_size=None, objective, instrument,
                # wavelength, checksum, organ, mouse, experiment, combined_data
                slice = SliceModel(values[9], values[10], re.sub("[^0-9]", "", values[11]), values[12], None, values[13], values[14],
                                   values[15], values[16], organ, mouse, experiment, file_name, file_sub_folder)
                slice.save_to_db()
            elif len(values) == 16:
                # uberon, orientation=None, slide_number, slice_id=None, z_step_size, objective, instrument,
                # wavelength, checksum, organ, mouse, experiment, combined_data
                slice = SliceModel(values[9], None, re.sub("[^0-9]", "", values[10]), None, values[11],
                                   values[12], values[13], values[14], values[15],
                                   organ, mouse, experiment, file_name, file_sub_folder)
                slice.save_to_db()

            print(file)
            # We will use this step
            # if os.path.isfile("{}{}/img/{}.png".format(path, file_sub_folder, file_name)):
            #     print("A png file already exists for {}".format(file_name_with_ext))
            # # If a jpeg is *NOT* present, create one from the tiff.
            # else:
            #     Path(path + file_sub_folder + "/img").mkdir(exist_ok=True)
            #     outfile = "{}{}/img/{}.png".format(path, file_sub_folder, file_name)
            #     print("outfile: ".format(outfile))
            #     try:
            #         im = Image.open(file)
            #         print("Generating png for {}".format(file_name_with_ext))
            #         # im.thumbnail(im.size)
            #         # im.convert('RGBA').save(outfile, "PNG", quality=100)
            #         basewidth = 900
            #         wp = (basewidth / float(im.size[0]))
            #         hsize = int(float(im.size[1]) * float(wp))
            #         im.mode = 'I'
            #         im.resize((basewidth, hsize), Image.ANTIALIAS).point(lambda i: i * (1. / 256)).convert(
            #             'L').save(outfile, "PNG", quality=100)
            #     except Exception as e:
            #         print(e)
            new_files += 1
        except PermissionError as p:
            p_denied += 1
            slice.delete_from_db()
        except Exception as e:
            # return "Please check the file name: {}\n Exception {}\n".format(name[0:-4], str(e))
            skipped += 1
            print("Skipped the file: {}".format(file_name_with_ext))
            print("Please check the file name: {}\n Exception {}\n".format(file_name, str(e)))


    return "<h1>Status:</h1> <br/> <h3>Skipped old files:{}</h3> <br/><h3>Added new files:{}</h3> <br/> <h3>Permission denied:{}</h3>".format(
        skipped, new_files, p_denied)
