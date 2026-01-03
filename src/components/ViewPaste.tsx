// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { apiService } from '../api/paste';
// import type { PasteData } from '../types/Paste';
// import { formatTimeRemaining, copyToClipboard } from '../utils/validators';
// import { ErrorMessage } from './ErrorMessage';

// export const ViewPaste = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [paste, setPaste] = useState<PasteData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     const fetchPaste = async () => {
//       if (!id) {
//         setError('Invalid paste ID');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const data = await apiService.getPaste(id);
//         setPaste(data);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : 'Failed to load paste'
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaste();
//   }, [id]);

//   const handleCopyContent = async () => {
//     if (paste?.content) {
//       const success = await copyToClipboard(paste.content);
//       if (success) {
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       }
//     }
//   };

//   const handleCreateNew = () => {
//     navigate('/');
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <div className="flex items-center justify-center space-x-2">
//             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//             <span className="text-gray-600 font-medium">Loading paste...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !paste) {
//     return (
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg
//                 className="w-8 h-8 text-red-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Paste Not Found
//             </h2>
//             <p className="text-gray-600 mb-6">
//               {error || 'This paste does not exist or has expired.'}
//             </p>
//             <button
//               onClick={handleCreateNew}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//             >
//               Create New Paste
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold text-white">Paste Content</h1>
//             <button
//               onClick={handleCopyContent}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 copied
//                   ? 'bg-green-500 text-white'
//                   : 'bg-white text-blue-600 hover:bg-gray-100'
//               }`}
//             >
//               {copied ? (
//                 <span className="flex items-center gap-2">
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                   Copied!
//                 </span>
//               ) : (
//                 <span className="flex items-center gap-2">
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                     />
//                   </svg>
//                   Copy
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Metadata */}
//         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//           <div className="flex flex-wrap gap-4 text-sm">
//             {paste.remaining_views !== null && (
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-4 h-4 text-gray-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                   />
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                   />
//                 </svg>
//                 <span className="text-gray-700">
//                   <span className="font-semibold">{paste.remaining_views}</span>{' '}
//                   view{paste.remaining_views !== 1 ? 's' : ''} remaining
//                 </span>
//               </div>
//             )}

//             {paste.expires_at && (
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-4 h-4 text-gray-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <span className="text-gray-700">
//                   Expires in{' '}
//                   <span className="font-semibold">
//                     {formatTimeRemaining(paste.expires_at)}
//                   </span>
//                 </span>
//               </div>
//             )}

//             {paste.remaining_views === null && !paste.expires_at && (
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-4 h-4 text-green-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//                 <span className="text-gray-700 font-semibold">
//                   No expiration
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
//             {paste.content}
//           </pre>
//         </div>

//         {/* Footer Actions */}
//         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//           <button
//             onClick={handleCreateNew}
//             className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
//           >
//             Create New Paste
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };














import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../api/paste';
import type { PasteData } from '../types/Paste';
import { formatTimeRemaining, copyToClipboard } from '../utils/validators';

export const ViewPaste = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
      if (!id) {
        setError('Invalid paste ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // This will fetch from your backend API
        const data = await apiService.getPaste(id);
        setPaste(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load paste'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  const handleCopyContent = async () => {
    if (paste?.content) {
      const success = await copyToClipboard(paste.content);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/');
  };

  const handleCopyUrl = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);
    if (success) {
      alert('URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">Loading paste...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Paste Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'This paste does not exist or has expired.'}
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create New Paste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-xl font-bold text-white">Viewing Paste: {id}</h1>
            <div className="flex gap-2">
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Share Link
              </button>
              <button
                onClick={handleCopyContent}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-blue-600 hover:bg-gray-100'
                }`}
              >
                {copied ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Copy Content
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm">
            {paste.remaining_views !== null && (
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-gray-700">
                  <span className="font-bold text-blue-600">{paste.remaining_views}</span>{' '}
                  view{paste.remaining_views !== 1 ? 's' : ''} remaining
                </span>
              </div>
            )}

            {paste.expires_at && (
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700">
                  Expires in{' '}
                  <span className="font-bold text-orange-600">
                    {formatTimeRemaining(paste.expires_at)}
                  </span>
                </span>
              </div>
            )}

            {paste.remaining_views === null && !paste.expires_at && (
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-green-700 font-semibold">
                  No expiration
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Paste Content:</span>
            <span className="text-xs text-gray-500">{paste.content.length} characters</span>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed shadow-inner">
{paste.content}</pre>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Create New Paste
          </button>
          <p className="text-xs text-gray-500">
            This is what people see when they visit your shared link! The paste content is displayed safely without executing any code.
          </p>
        </div>
      </div>
    </div>
  );
};