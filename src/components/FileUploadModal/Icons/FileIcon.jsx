import React from 'react'
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CodeIcon from '@mui/icons-material/Code';
import AudioFileIcon from '@mui/icons-material/AudioFile';

const FileIcon = ({ext}) => {
   
    const colorsCode={
        doc:'#2892e7d6',
        docx:'#2892e7d6',
        pdf:'#EE2F37',
        gif:'#405de6aa',
        png:'#7CB2D2aa',
        jpeg:'#74BE73aa',
        jpg:'#74BE73',
        htm:'#FFA500',
        html:'#FFA500',
        css:'#95BCD4',
        js:'#D1AC2Ecd',
        json:'#D1AC2Ecd',
        exe:'#ff8928',
        jar:'#ffc202',
        rar:'#9bc400aa',
        zip:'#F0BC2C',
        bat:'#c0ff2d',
        bin:'#ffabb6',
        csv:'#ffaaab',
        iso:'#c89666',
        mp4:'#8076a3',
        mp3:'#9950A6',
        mkv:'#478559aa',
        mpeg:'#00beffaa',
        ppsx:'#ffcb00',
        tmp:'#ec1f52aa',
        txt:'#5D68BF',
        xls:'#67AA46',
        ppt:'#F68852',
        eps:'#EFA162',
        wav:'#176E88',
        mov:'#006CB7',
        psd:'#297CAF',
    }

    if(ext=='doc'||ext=='docx')
    {
        return <TextSnippetIcon sx={{fontSize: '80px', color:colorsCode[ext]||"#2892e7d6"}} />
    }
    if(ext=='png'||ext=='jpg'||ext=='jpeg')
    {
        return <PhotoLibraryOutlinedIcon sx={{fontSize: '80px', color:colorsCode[ext]||"#2892e7d6"}} />
    }
    if(ext=='pdf')
    {
        return <PictureAsPdfIcon sx={{fontSize: '80px', color:colorsCode[ext]||"#2892e7d6"}} />
    }
    if(ext=='txt')
    {
        return <ArticleOutlinedIcon sx={{fontSize: '80px', color:colorsCode[ext]||"#2892e7d6"}} />
    }
    if(ext=='mp3')
    {
        return <AudioFileIcon sx={{fontSize: '80px', color:colorsCode[ext]||"#2892e7d6"}} />
    }
    if(ext=='htm'||ext=='html')
    {
        return <CodeIcon sx={{fontSize: '80px', color:colorsCode[ext]||"#2892e7d6"}} />
    }


    return (
    <>
      <InsertDriveFileOutlinedIcon sx={{fontSize: '80px', color:colorsCode[ext]||"#2892e7d6"}} />
    </>
  )
}

export default FileIcon