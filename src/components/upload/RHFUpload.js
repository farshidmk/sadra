import PropTypes from 'prop-types';
// form
import {useFormContext, Controller} from 'react-hook-form';
// @mui
import {Button,Card, FormHelperText, IconButton, Stack} from '@mui/material';
//
import {UploadAvatar, UploadSingleFile, UploadMultiFile} from '../upload';
import {useState} from "react";

import {backendUrl} from "../../config";
import axios from "axios";
import useLocales from "../../hooks/useLocales";
import {ImgList, ImgListBox, ImgListImg, ImgListItem, ImgListWrapper} from "../../helpers/ImageListStyles";
// ----------------------------------------------------------------------



RHFUploadAvatar.propTypes = {
    name: PropTypes.string,
};

export function RHFUploadAvatar({name, ...other}) {
    const {control} = useFormContext();


    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: {error}}) => {
                const checkError = !!error && !field.value;

                return (
                    <div>
                        <UploadAvatar error={checkError} {...other} file={field.value}/>
                        {checkError && (
                            <FormHelperText error sx={{px: 2, textAlign: 'center'}}>
                                {error.message}
                            </FormHelperText>
                        )}
                    </div>
                );
            }}
        />
    );
}

// ----------------------------------------------------------------------

RHFUploadSingleFile.propTypes = {
    name: PropTypes.string,
};

export function RHFUploadSingleFile({name, ...other}) {
    const {control} = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: {error}}) => {
                const checkError = !!error && !field.value;

                return (
                    <UploadSingleFile
                        accept="image//*"
                        file={field.value}
                        error={checkError}
                        helperText={
                            checkError && (
                                <FormHelperText error sx={{px: 2}}>
                                    {error.message}
                                </FormHelperText>
                            )
                        }
                        {...other}
                    />
                );
            }}
        />
    );
}

// ----------------------------------------------------------------------

RHFUploadMultiFile.propTypes = {
    name: PropTypes.string,
};

export function RHFUploadMultiFile({name, defaultImages,shopId,...other}) {
    const {control} = useFormContext();
    const [files, setFiles] = useState(defaultImages);
    const {translate} = useLocales()


    return (
        <Controller
            name={name}
            control={control}
            render={({
                         field,
                         fieldState: {error}
                     }) => {
                const checkError = !!error && field.value?.length === 0;

                const handleDeleteImage = async () => {

                    const formData = new FormData()
                    formData.append('shopId', shopId)
                    await axios.post(`${backendUrl}/shops/destroy-images`,formData,{
                        withCredentials: true,
                    })

                    const updatedFiles = [...files];
                    updatedFiles.splice(0, files.length);
                    setFiles(updatedFiles);
                };

                return (
                    <>
                        <UploadMultiFile
                            accept="image/*"
                            files={field.value}
                            error={checkError}
                            helperText={
                                checkError && (
                                    <FormHelperText error sx={{px: 2}}>
                                        {error?.message}
                                    </FormHelperText>
                                )
                            }
                            {...other}
                        />
                        { files.length > 0 && (
                        <Card sx={{mt: 3, background: '#F4F6F8', border: '1px dashed #ccc'}}>
                            <ImgList>
                                {files.map((file, index) => (
                                    <ImgListItem key={index}
                                                 className="MuiListItem-root MuiListItem-gutters MuiListItem-padding rtl-14m77yx-MuiListItem-root">
                                        <ImgListBox>
                                            <ImgListWrapper>
                                                <ImgListImg src={file} alt={`Image ${index}`} />
                                            </ImgListWrapper>
                                        </ImgListBox>
                                    </ImgListItem>
                                ))}
                                {files.length > 0 &&
                                    <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                                        <Button color="inherit" size="small"
                                                onClick={() => handleDeleteImage()}>
                                            {translate('form.removeAll')}
                                        </Button>
                                    </Stack>
                                }
                            </ImgList>
                        </Card>
                            )}
                    </>
                );
            }}
        />
    );
}
