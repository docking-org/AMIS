from app.data.models.genotype import GenotypeModel
from app.data.models.gene import GeneModel
from app.data.models.mouse import MouseModel
from app.data.models.mani_type import ManipulationTypeModel
from app.data.models.organ import OrganModel
from app.data.models.slice import SliceModel
from app.data.models.experiment import ExperimentModel
from flask import current_app
import os
from PIL import Image


def save_excel_records(type, records):
    line = 1
    for record in records:
        combined_values = '_'.join('{}'.format(value) for key, value in record.items()).replace(" ", "_")
        print(combined_values)
        line += 1
        # genotype = GenotypeModel.find_by_name(record['genotype'])
        try:
            genotype_gene = GenotypeModel.find_by_id(record['genotype_gene'])
            genotype_reporter = GenotypeModel.find_by_id(record['genotype_reporter'])
            # print(genotype)
            gene = GeneModel(record['gene'], genotype_gene, genotype_reporter)
            mani_type = ManipulationTypeModel.find_by_name(record['manipulation_type'])
            if mani_type is None:
                mani_type = ManipulationTypeModel(record['manipulation_type'])
            sex = 1
            if record['sex'].upper() == "F":
                sex = 0
            mouse = MouseModel(record['mouse_number'], sex, record['age'], gene, mani_type)
            organ = OrganModel.find_by_name(record['organ'])
            if organ is None:
                organ = OrganModel(record['organ'])
            experiment = ExperimentModel.find_by_name(record['experiment'])
            if experiment is None:
                experiment = ExperimentModel(record['experiment'])
            print("hi you got here")
            if type == 'slide':
                # self, slide_number, sample_number, slice_id, orientation, location_index, z_step_size,
                # resolution, instrument, wavelength, probe_id, survey_classification, checksum, organ,
                # mouse, experiment, combined_data):
                slice = SliceModel(record['slide_number'], None, record['slice_id'], record['orientation'],
                                   record['location_index'], None, record['resolution'], record['instrument'],
                                   record['wavelength'], record['probe_id'], record['survey_classification'],
                                   record['checksum'], organ, mouse, experiment, combined_values)
                slice.save_to_db()
            elif type == 'cleared':
                slice = SliceModel(None, record['sample_number'], record['slice_id'], None, None,
                                   record['z_step_size'], record['resolution'], record['instrument'],
                                   record['wavelength'], record['probe_id'], record['survey_classification'],
                                   record['checksum'], organ, mouse, experiment, combined_values)
                slice.save_to_db()
            else:
                return "Please check URL. It must be '/upload/slide' or '/upload/cleared'"
        except Exception as e:
            return "Please check line number: {}\n Exception {}\n".format(line, str(e))


def save_file_list(lst):
    skipped = 0
    new_files = 0
    for name in lst:
        if name[-4:] == '.tif':
            if SliceModel.isRegistered(name[0:-4]):
                skipped += 1
                print("_______________Skipped the file: {}".format(name))
                continue;
            values = name[0:-4].split('_')
            try:
                genotype_gene = GenotypeModel.find_by_id(values[2])
                if genotype_gene is None:
                    genotype_gene = GenotypeModel(values[2], None)
                    genotype_gene.save_to_db()
                genotype_reporter = GenotypeModel.find_by_id(values[3])
                if genotype_reporter is None:
                    genotype_reporter = GenotypeModel(values[3], None)
                    genotype_reporter.save_to_db()
                gene = GeneModel.find_by_name_ids(values[0], genotype_gene, genotype_reporter)
                if gene is None:
                    gene = GeneModel(values[0], genotype_gene, genotype_reporter)
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
                    # self, slide_number, sample_number, slice_id, uberon, orientation, location_index, z_step_size,
                    # resolution, instrument, wavelength, probe_id, survey_classification, checksum, organ,
                    # mouse, experiment, combined_data):
                    slice = SliceModel(None, None, values[11], values[9], values[10],
                                       None, values[12], values[13], values[14],
                                       values[15], None, None,
                                       values[16], organ, mouse, experiment, name[0:-4])
                    slice.save_to_db()
                elif len(values) == 16:
                    # self, slide_number, sample_number, slice_id, uberon, orientation, location_index, z_step_size,
                    # resolution, instrument, wavelength, probe_id, survey_classification, checksum, organ,
                    # mouse, experiment, combined_data):
                    slice = SliceModel(values[10], None, values[11], None, values[9],
                                       None, None, values[12], values[13],
                                       values[14], None, None,
                                       values[15], organ, mouse, experiment, name[0:-4])
                    slice.save_to_db()


                root = current_app.config['IMAGE_LOAD_FOLDER']
                print(os.path.join(root, name))
                if os.path.splitext(os.path.join(root, name))[1].lower() == ".tif":
                    if os.path.isfile(os.path.splitext(os.path.join(root, name))[0] + ".png"):
                        print("A png file already exists for {}".format(name))
                    # If a jpeg is *NOT* present, create one from the tiff.
                    else:
                        outfile = os.path.splitext(os.path.join(root, name))[0] + ".png"
                        print("outfile: ".format(outfile))
                        try:
                            im = Image.open(os.path.join(root, name))
                            print("Generating png for {}".format(name))
                            # im.thumbnail(im.size)
                            # im.convert('RGBA').save(outfile, "PNG", quality=100)
                            basewidth = 800
                            wp = (basewidth / float(im.size[0]))
                            hsize = int(float(im.size[1]) * float(wp))
                            im.mode = 'I'
                            im.resize((basewidth, hsize), Image.ANTIALIAS).point(lambda i: i * (1. / 256)).convert('L').save(outfile, "PNG", quality=100)
                        except Exception as e:
                            print(e)
                new_files +=1
            except Exception as e:
                #return "Please check the file name: {}\n Exception {}\n".format(name[0:-4], str(e))
                skipped +=1
                print("Skipped the file: {}".format(name))
                print("Please check the file name: {}\n Exception {}\n".format(name[0:-4], str(e)))
    return "Succeed! skipped old files:{}, added new files:{}".format(skipped, new_files)