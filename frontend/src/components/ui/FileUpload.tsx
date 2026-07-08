import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, X } from "lucide-react";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_MB } from "@/constants";

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export function FileUpload({ file, onFileSelect, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const selected = files[0];
      if (selected.size > MAX_UPLOAD_MB * 1024 * 1024) {
        onFileSelect(null);
        return;
      }
      onFileSelect(selected);
    },
    [onFileSelect]
  );

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl2 border border-slate-200 dark:border-white/10 bg-white dark:bg-surface-dark-raised p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300">
          <FileText size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{file.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
        </div>
        <button
          onClick={() => onFileSelect(null)}
          aria-label="Remove file"
          className="text-slate-400 hover:text-danger-500"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <motion.label
        htmlFor="resume-upload-input"
        animate={{
          borderColor: isDragging ? "#6366f1" : "rgba(148,163,184,0.4)",
          scale: isDragging ? 1.01 : 1,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed bg-slate-50/50 dark:bg-white/5 px-6 py-10 text-center transition-colors"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-white">
          <UploadCloud size={22} />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Drag &amp; drop your resume, or <span className="text-primary-600 dark:text-primary-400">browse</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {ACCEPTED_FILE_TYPES.join(", ")} · up to {MAX_UPLOAD_MB}MB
        </p>
        <input
          ref={inputRef}
          id="resume-upload-input"
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </motion.label>
      {error && <p className="mt-2 text-sm text-danger-500">{error}</p>}
    </div>
  );
}
