import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiService } from '../api/paste';
import { ErrorMessage } from './ErrorMessage';

interface FormValues {
  content: string;
  ttlEnabled: boolean;
  ttlSeconds: number;
  maxViewsEnabled: boolean;
  maxViews: number;
}

const validationSchema = Yup.object({
  content: Yup.string()
    .required('Content is required')
    .min(1, 'Content cannot be empty')
    .max(100000, 'Content is too long (max 100,000 characters)'),
  ttlSeconds: Yup.number().when('ttlEnabled', {
    is: true,
    then: (schema) =>
      schema
        .required('TTL is required')
        .integer('TTL must be a whole number')
        .min(1, 'TTL must be at least 1 second')
        .max(31536000, 'TTL cannot exceed 1 year'),
  }),
  maxViews: Yup.number().when('maxViewsEnabled', {
    is: true,
    then: (schema) =>
      schema
        .required('Max views is required')
        .integer('Max views must be a whole number')
        .min(1, 'Max views must be at least 1')
        .max(1000000, 'Max views cannot exceed 1,000,000'),
  }),
});

export const CreatePaste = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      content: '',
      ttlEnabled: false,
      ttlSeconds: 3600,
      maxViewsEnabled: false,
      maxViews: 10,
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);

      try {
        const payload: any = {
          content: values.content,
        };

        if (values.ttlEnabled) {
          payload.ttl_seconds = values.ttlSeconds;
        }

        if (values.maxViewsEnabled) {
          payload.max_views = values.maxViews;
        }

        const response = await apiService.createPaste(payload);
        setSuccess(response);
        formik.resetForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create paste');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleCopyUrl = async () => {
    if (success?.url) {
      try {
        await navigator.clipboard.writeText(success.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleCreateAnother = () => {
    setSuccess(null);
    setCopied(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Paste Created Successfully!
            </h2>
            <p className="text-gray-600">
              Your paste has been created and is ready to share
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shareable URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={success.url}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-sm"
              />
              <button
                onClick={handleCopyUrl}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={success.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
            >
              View Paste
            </a>
            <button
              onClick={handleCreateAnother}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Create New Paste
        </h2>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={12}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm ${
                formik.touched.content && formik.errors.content
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Paste your content here..."
              disabled={loading}
            />
            {formik.touched.content && formik.errors.content && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.content}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formik.values.content.length} characters
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Optional Constraints
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="ttlEnabled"
                  name="ttlEnabled"
                  checked={formik.values.ttlEnabled}
                  onChange={formik.handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <div className="flex-1">
                  <label
                    htmlFor="ttlEnabled"
                    className="block font-medium text-gray-700 cursor-pointer"
                  >
                    Time-based Expiry (TTL)
                  </label>
                  {formik.values.ttlEnabled && (
                    <div className="mt-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          id="ttlSeconds"
                          name="ttlSeconds"
                          value={formik.values.ttlSeconds}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          min="1"
                          className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 ${
                            formik.touched.ttlSeconds && formik.errors.ttlSeconds
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                          disabled={loading}
                        />
                        <span className="text-gray-600">seconds</span>
                      </div>
                      {formik.touched.ttlSeconds && formik.errors.ttlSeconds && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.ttlSeconds}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Paste will expire after this duration
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="maxViewsEnabled"
                  name="maxViewsEnabled"
                  checked={formik.values.maxViewsEnabled}
                  onChange={formik.handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <div className="flex-1">
                  <label
                    htmlFor="maxViewsEnabled"
                    className="block font-medium text-gray-700 cursor-pointer"
                  >
                    View Count Limit
                  </label>
                  {formik.values.maxViewsEnabled && (
                    <div className="mt-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          id="maxViews"
                          name="maxViews"
                          value={formik.values.maxViews}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          min="1"
                          className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 ${
                            formik.touched.maxViews && formik.errors.maxViews
                              ? 'border-red-500'
                              : 'border-gray-300'
                          }`}
                          disabled={loading}
                        />
                        <span className="text-gray-600">views</span>
                      </div>
                      {formik.touched.maxViews && formik.errors.maxViews && (
                        <p className="mt-1 text-sm text-red-600">
                          {formik.errors.maxViews}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Paste will expire after this many views
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formik.values.content.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </form>
      </div>
    </div>
  );
};