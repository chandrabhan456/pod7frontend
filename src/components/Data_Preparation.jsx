import React,{useState} from 'react'

const Data_Preparation = () =>  {
    const [activeView, setActiveView] = useState('without');
    const [tableRows, setTableRows] = useState([
        { columnName: '', value: '', example: '', width: '', alignment: '' }
      ]);
    
      const handleInputChange = (index, field, value) => {
        const updatedRows = [...tableRows];
        updatedRows[index][field] = value;
        setTableRows(updatedRows);
      };
    
      const handleAddRow = () => {
        setTableRows([
          ...tableRows,
          { columnName: '', value: '', example: '', width: '', alignment: '' }
        ]);
      };

  return (
    <div className="min-h-screen w-full bg-white text-black relative">
      <div className="upload-container relative bg-gray-100 p-4 min-h-screen">
       
          {/* Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveView('without')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-40"
            >
              Without-OpenAI
            </button>
            <button
              onClick={() => setActiveView('openai')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-40"
            >
              OpenAI
            </button>
          </div>

          {/* Without-OpenAI Content */}
          {activeView === 'without' && (
            <div className="p-4 border  rounded overflow-auto">
              
              <table className="w-full border border-collapse">
                <thead>
                  <tr className=" border-0 bg-gray-200 text-left">
                    <th className="border p-2">Column Name</th>
                    <th className="border p-2">Value</th>
                    <th className="border p-2">Example</th>
                    <th className="border p-2">Width</th>
                    <th className="border p-2">Alignment</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={index} className="bg-white">
                      <td className="border-0 p-2">
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={row.columnName}
                          onChange={(e) =>
                            handleInputChange(index, 'columnName', e.target.value)
                          }
                        />
                      </td>
                      <td className="border-0 p-2">
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={row.value}
                          onChange={(e) =>
                            handleInputChange(index, 'value', e.target.value)
                          }
                        />
                      </td>
                      <td className="border-0 p-2">
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={row.example}
                          onChange={(e) =>
                            handleInputChange(index, 'example', e.target.value)
                          }
                        />
                      </td>
                      <td className="border-0 p-2">
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={row.width}
                          onChange={(e) =>
                            handleInputChange(index, 'width', e.target.value)
                          }
                        />
                      </td>
                      <td className="border-0 p-2">
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1"
                          value={row.alignment}
                          onChange={(e) =>
                            handleInputChange(index, 'alignment', e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex justify-between">
  <button
    onClick={handleAddRow}
    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-32"
  >
    Add New
  </button>

  <button
  
    className="px-4 py-2 bg-[#578FCA] text-white rounded hover:bg-[#1e3a8a] w-32"
  >
    Create
  </button>
</div>

            </div>
          )}

          {/* OpenAI Content */}
          {activeView === 'openai' && (
            <div className="p-4 border border-green-300 rounded">
              <h2 className="text-xl font-bold mb-2">OpenAI Content</h2>
              <p>This is the section that appears when clicking "OpenAI".</p>
            </div>
          )}
        </div>
      </div>
    
  );
}


export default Data_Preparation
