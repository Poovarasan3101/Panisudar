import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { aiResumeService } from '@/api/aiResumeService';

export default function ResumeUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile) => {
    const validExtensions = ['.pdf', '.docx'];
    const hasValidExt = validExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      setError('Please upload a valid PDF or DOCX file.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleUploadAndParse = async () => {
    if (!file) return;
    setError('');
    setLoading(true);
    setStatusMessage('Reading document text...');

    try {
      setTimeout(() => {
        if (loading) setStatusMessage('Identifying sections and extracting skills...');
      }, 900);

      const parsedData = await aiResumeService.uploadResumeFile(file);
      setStatusMessage('Resume parsed successfully!');
      setTimeout(() => {
        onUploadSuccess(parsedData);
        onClose();
      }, 600);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to extract resume data. Please ensure the file is not corrupted.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Existing Resume</h3>
              <p className="text-xs text-slate-400">PDF and DOCX formats supported</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/20'
                : file
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : 'border-slate-700 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-950'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-white">{file.name}</div>
                <div className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB • Click or drop another to replace
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-cyan-400 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">
                    <span className="text-cyan-400 underline decoration-cyan-400/50">Click to browse</span> or drag & drop your resume file
                  </div>
                  <div className="text-xs text-slate-500 mt-1">PDF or DOCX (up to 10MB)</div>
                </div>
              </div>
            )}
          </div>

          {/* AI Extraction Features List */}
          <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              What Panisudar AI Extracts Automatically:
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
              <div>• Contact info & links</div>
              <div>• Experience & roles</div>
              <div>• Education & degrees</div>
              <div>• Technical & soft skills</div>
              <div>• Summary & objectives</div>
              <div>• Projects & key highlights</div>
            </div>
          </div>

          {/* Status / Error Messages */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/30 border border-rose-500/30 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-cyan-300 bg-cyan-950/30 border border-cyan-500/30 p-3 rounded-xl animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-cyan-400" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUploadAndParse}
            disabled={!file || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Parsing Document...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Parse & Populate Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
