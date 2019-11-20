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
import shutil
import glob
from pathlib import Path


def save_excel_records(type, records):
    # line = 1
    for record in records:
        pass
        # Upload from file is not working now. If we need this feature,
        # We have to fix below commented codes
        # combined_values = '_'.join('{}'.format(value) for key, value
        # in record.items()).replace(" ", "_")
        # print(combined_values)
        # line += 1
        # # genotype = GenotypeModel.find_by_name(record['genotype'])
        # try:
        #     genotype_gene = GenotypeModel.find_by_id(record['genotype_gene'])
        #     genotype_reporter = GenotypeModel.find_by_id(
        #     record['genotype_reporter'])
        #     # print(genotype)
        #     gene = GeneModel(record['gene'], genotype_gene,
        #     genotype_reporter)
        #     mani_type = ManipulationTypeModel.find_by_name(
        #     record['manipulation_type'])
        #     if mani_type is None:
        #         mani_type = ManipulationTypeModel(
        #         record['manipulation_type'])
        #     sex = 1
        #     if record['sex'].upper() == "F":
        #         sex = 0
        #     mouse = MouseModel(record['mouse_number'], sex,
        #     record['age'], gene, mani_type)
        #     organ = OrganModel.find_by_name(record['organ'])
        #     if organ is None:
        #         organ = OrganModel(record['organ'])
        #     experiment = ExperimentModel.find_by_name(record['experiment'])
        #     if experiment is None:
        #         experiment = ExperimentModel(record['experiment'])
        #     if type == 'slide':
        #         # self, slide_number, sample_number, slice_id, orientation,
        #         #location_index, z_step_size,
        #         # resolution, instrument, wavelength, probe_id,
        #         survey_classification, c
        #         #hecksum, organ,
        #         # mouse, experiment, combined_data):
        #
        #         # uberon, orientation, slide_number, slice_id, objective,
        #         # instrument, wavelength, checksum, organ, mouse, experiment,
        #         # combined_data
        #         slice = SliceModel(record['slide_number'], None,
        #         record['slice_id'], record['orientation'],
        #                            record['location_index'], None,
        #                            record['objective'], record['instrument'],
        #                            record['wavelength'],
        #                            record['checksum'], organ,
        #                            mouse, experiment, combined_values)
        #         slice.save_to_db()
        #     elif type == 'cleared':
        #         slice = SliceModel(None, record['sample_number'],
        #         record['slice_id'], None, None,
        #                            record['z_step_size'],
        #                            record['objective'], record['instrument'],
        #                            record['wavelength'],
        #                            record['probe_id'],
        #                            record['survey_classification'],
        #                            record['checksum'],
        #                            organ, mouse, experiment, combined_values)
        #         slice.save_to_db()
        #     else:
        #         return "Please check URL. It must be
        #         '/upload/slide' or '/upload/cleared'"
        # except Exception as e:
        #     return "Please check line number:
        #     {}\n Exception {}\n".format(line, str(e))


def load_images():
    skipped = 0
    new_files = 0
    jpegs = 0
    moved_jpegs = 0
    p_denied = 0
    missing_jpegs = []
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
        if "hidden" in file_sub_folder:
            print("_______________Skipped the file in HIDDEN dir: {}/{}".
                  format(file_sub_folder, file_name_with_ext))
            continue

        if SliceModel.isRegistered(file_name):
            destination = "{}{}/".format(path, file_sub_folder)
            dest_file_with_jpeg = "{}{}.jpg".format(destination, file_name)
            # print("DEST:"+destination+file_name)
            # print("dest_file_with_jpeg:" + dest_file_with_jpeg)
            if not os.path.isfile(dest_file_with_jpeg):
                jpegs += 1
                jpeg_folder = current_app.config['JPEG_FOLDER']
                jpeg_path = os.path.realpath(os.path.dirname(jpeg_folder))
                print("jpeg_path:" + jpeg_path)
                source = "{}/{}.jpg".format(jpeg_path, file_name)
                print("SOURCE:" + source)
                try:
                    if os.path.isfile(source):
                        moved_jpegs += 1
                        print("DEST:" + destination)
                        print("SOURCE:" + source)
                        shutil.move(source, destination)
                        print("JPEG file has been moved to " + destination)
                    else:
                        missing_jpegs.append(dest_file_with_jpeg)
                except Exception as e:
                    print(e)
            skipped += 1
            print("_______________Skipped the file: {}".format(
                file_name_with_ext))
            continue
        values = file_name.replace('_RI', '').split('_')
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
            gene = GeneModel.find_by_gene_name_ids(gene_name, genotype_gene,
                                                   genotype_reporter)
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
            if values[14].upper() != "LSM":
                # uberon, orientation, slide_number, slice_id,
                # z_step_size=None, objective, instrument,
                # wavelength, checksum, organ, mouse,
                # experiment, combined_data, sub_folder
                slice = SliceModel(values[9], values[10], values[11],
                                   values[12], None,
                                   values[13], values[14], values[15],
                                   values[16],
                                   organ, mouse, experiment, file_name,
                                   file_sub_folder)
                slice.save_to_db()
            else:
                # uberon, orientation, slide_number=None, slice_id,
                # z_step_size, objective, instrument,
                # wavelength, checksum, organ, mouse, experiment,
                # combined_data, sub_folder
                slice = SliceModel(values[9], values[10], None, values[11],
                                   values[12],
                                   values[13], values[14], values[15],
                                   values[16],
                                   organ, mouse, experiment, file_name,
                                   file_sub_folder)
                slice.save_to_db()
            new_files += 1
            print(file)

        except PermissionError:
            p_denied += 1
            slice.delete_from_db()
        except Exception as e:
            # return "Please check the file name:
            # {}\n Exception {}\n".format(name[0:-4], str(e))
            skipped += 1
            print("Skipped the file: {}".format(file_name_with_ext))
            print("Please check the file name: {}/{}\n Exception {}\n".format(
                file_sub_folder, file_name, str(e)))

    with open(path + '/missing_jpeg_paths.txt', 'w') as file_handler:
        for item in missing_jpegs:
            file_handler.write("{}\n".format(item))

    return "<h1>Status:</h1> <br/> <h3>Skipped old files:{}</h3> <br/>" \
           "<h3>Added new files:{}</h3> <br/> " \
           "<h3>Permission denied:{}</h3><br/> <h3>JPEG(s) not found:{}</h3>" \
           "<br/> <h3>JPEG(s) has been moved to RIGHT directory:{}</h3>" \
        .format(skipped,
                new_files,
                p_denied,
                jpegs,
                moved_jpegs)
