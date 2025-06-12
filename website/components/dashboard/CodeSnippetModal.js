import React from 'react';
import { FaFileAlt, FaPalette, FaCopy, FaPaintBrush, FaCode, FaInfoCircle, FaLightbulb } from 'react-icons/fa';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { generateIntegrationSnippet, getUserIdMappingInstructions } from '../../utils/codeSnippets';
import { getVanillaJSExample, getReactComponentExample, getCancelReadyScriptTag } from '../../utils/cancelButtonHelpers';

/**
 * Modal component for displaying integration code snippets
 */
const CodeSnippetModal = ({
  showCodeSnippet,
  handleCloseCodeSnippet,
  handleCopyCodeSnippet,
  generateCodeSnippet,
  selectedProviderForSnippet,
  setSelectedProviderForSnippet,
  buttonSettings,
  handleButtonSettingChange,
  handleSaveSettings,
  colorOptions
}) => {
  if (!showCodeSnippet) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseCodeSnippet}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Close button START */}
          <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block z-10">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleCloseCodeSnippet}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          {/* Close button END */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                  <FaFileAlt className="mr-2 text-blue-500" />
                  Integration Code Snippet
                </h3>

                {/* Top Section - Select Provider */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center">
                      <FaCode className="text-blue-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-700">Select Payment Provider:</h4>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProviderForSnippet('stripe')}
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-all ${
                          selectedProviderForSnippet === 'stripe'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Stripe
                      </button>
                      <button
                        onClick={() => setSelectedProviderForSnippet('paddle')}
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-all ${
                          selectedProviderForSnippet === 'paddle'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Paddle
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Button Customization */}
                  <div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                        <FaPaintBrush className="mr-2 text-purple-500" />
                        Customize Button
                      </h4>
                      
                      {/* Button Preview */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 flex flex-col items-center">
                        <p className="text-xs text-gray-500 mb-3 self-start">Preview</p>
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg flex justify-center w-full">
                          <button
                            type="button"
                            className="px-4 py-2 rounded text-white shadow-sm transition-all hover:shadow-md"
                            style={{ backgroundColor: buttonSettings.buttonColor }}
                          >
                            {buttonSettings.buttonText}
                          </button>
                        </div>
                      </div>
                      
                      {/* Button Text Input */}
                      <div className="mb-4">
                        <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          id="buttonText"
                          value={buttonSettings.buttonText}
                          onChange={(e) => handleButtonSettingChange('buttonText', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* Color Picker */}
                      <div className="mb-4">
                        <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700 mb-2">
                          Button Color
                        </label>
                        <div className="flex items-center mb-3 bg-gray-50 p-2 rounded-md">
                          <input
                            type="color"
                            id="colorPicker"
                            value={buttonSettings.buttonColor}
                            onChange={(e) => handleButtonSettingChange('buttonColor', e.target.value)}
                            className="h-8 w-8 rounded border border-gray-300 cursor-pointer mr-2"
                          />
                          <input
                            type="text"
                            id="buttonColor"
                            value={buttonSettings.buttonColor}
                            onChange={(e) => handleButtonSettingChange('buttonColor', e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-2 mb-1">
                          {colorOptions.map((color) => (
                            <div 
                              key={color.value} 
                              className={`h-8 w-full rounded-md cursor-pointer border transition-all ${buttonSettings.buttonColor === color.value ? 'ring-2 ring-offset-1 ring-blue-500 scale-105' : 'border-gray-300 hover:ring-1 hover:ring-blue-300'}`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => handleButtonSettingChange('buttonColor', color.value)}
                              title={color.name}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Options */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Options</h5>
                        <div className="space-y-3">
                          {/* Test Mode Toggle */}
                          <div className="flex items-center">
                            <input
                              id="testMode"
                              name="testMode"
                              type="checkbox"
                              checked={buttonSettings.testMode}
                              onChange={(e) => handleButtonSettingChange('testMode', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="testMode" className="ml-2 block text-sm text-gray-700">
                              Test Mode (No actual cancellations)
                            </label>
                          </div>
                          
                          {/* Custom Branding Toggle */}
                          <div className="flex items-center">
                            <input
                              id="customBranding"
                              name="customBranding"
                              type="checkbox"
                              checked={buttonSettings.customBranding}
                              onChange={(e) => handleButtonSettingChange('customBranding', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="customBranding" className="ml-2 block text-sm text-gray-700">
                              Custom Branding (Modal Text)
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleSaveSettings}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors"
                      >
                        Save Settings
                      </button>
                    </div>
                  </div>
                  
                  {/* Middle Column - Code Snippet */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
                        <div className="flex items-center">
                          <FaCode className="text-blue-400 mr-2" />
                          <span className="text-sm font-medium text-gray-200">Integration Code</span>
                        </div>
                        <button 
                          onClick={handleCopyCodeSnippet}
                          className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md flex items-center transition-colors"
                        >
                          <FaCopy className="mr-1.5" />
                          Copy Code
                        </button>
                      </div>
                      <div className="bg-gray-900 overflow-hidden">
                        <pre className="p-4 text-gray-100 text-sm overflow-x-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                          {generateCodeSnippet()}
                        </pre>
                      </div>
                      
                      <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-center mb-3">
                          <FaInfoCircle className="text-blue-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">Implementation Guide</h3>
                        </div>
                        
                        <div className="rounded-md bg-blue-50 p-4 mb-4">
                          <div className="flex items-center mb-2">
                            <FaLightbulb className="text-amber-500 mr-2" />
                            <h4 className="text-md font-medium text-gray-800">Quick Start</h4>
                          </div>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                            <li>Copy the full code snippet above</li>
                            <li>Paste it directly into your HTML file where you want the cancel button to appear</li>
                            <li>Replace <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">"THE_END_USERS_ACTUAL_SUBSCRIPTION_ID"</code> with the actual subscription ID</li>
                          </ol>
                        </div>

                        <div className="mt-4 mb-3">
                          <h4 className="text-md font-medium text-gray-800 mb-2">Advanced Integration</h4>
                          <p className="text-sm text-gray-600 mb-3">For modular applications (React, Vue, Angular):</p>
                          
                          <div className="bg-gray-50 rounded-md p-3 border border-gray-200 mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Example (React Component):</p>
                            <div className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                              <pre>{getReactComponentExample()}</pre>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">Example (Vanilla JS):</p>
                            <div className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                              <pre>{`// 1. Ensure CancelReady script is loaded:
// ${getCancelReadyScriptTag()}

${getVanillaJSExample()}`}</pre>
                            </div>
                          </div>
                        </div>
                        
                        {/* User ID Mapping Instructions */}
                        <div className="mt-4" dangerouslySetInnerHTML={{ __html: getUserIdMappingInstructions() }} /> 
                        
                        <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-100">
                          <p className="text-sm font-medium text-amber-800">
                            Always test the cancellation flow in your development environment before deploying to production.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleCloseCodeSnippet}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal;
