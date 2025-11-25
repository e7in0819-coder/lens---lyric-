import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Video } from 'lucide-react';
import { MediaFile } from '../types';

interface FileUploadProps {
  onFileSelect: (media: MediaFile) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 20 * 1024 * 1024) {
      alert("File size too large. Please upload files under 20MB for this demo.");
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert("Please upload a valid image or video file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      // Extract base64 part
      const base64 = result.split(',')[1];
      
      onFileSelect({
        file,
        previewUrl: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image',
        base64,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input so same file can be selected again if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div 
      className={`
        border-2 border-dashed border-slate-700 hover:border-indigo-500 
        rounded-2xl p-10 transition-all duration-300 cursor-pointer
        bg-slate-800/50 hover:bg-slate-800 flex flex-col items-center justify-center
        group ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      onClick={triggerUpload}
    >
      <input 
        type="file" 
        ref={inputRef}
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,video/*"
      />
      
      <div className="bg-slate-700/50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
        <Upload className="w-8 h-8 text-indigo-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-200 mb-2">
        Upload Image or Video
      </h3>
      <p className="text-slate-400 text-sm text-center max-w-xs">
        Click to select media. We'll analyze the concepts and generate captions.
      </p>
      
      <div className="flex gap-4 mt-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full">
          <ImageIcon className="w-3 h-3" /> JPG, PNG, WEBP
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full">
          <Video className="w-3 h-3" /> MP4, WEBM
        </div>
      </div>
    </div>
  );
};