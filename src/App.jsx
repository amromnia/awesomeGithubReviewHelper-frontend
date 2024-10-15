import React, { useState } from 'react';
import './App.css';

import DiffViewer from './DiffViewer'; // Import the DiffViewer component


const App = () => {
const [repoUrl, setRepoUrl] = useState('');
const [branches, setBranches] = useState([]);
const [prs, setPrs] = useState([]);
const [selectedBranch, setSelectedBranch] = useState('');
const [selectedPr, setSelectedPr] = useState('');
const [diffs, setDiffs] = useState([]);
const [selectedFile, setSelectedFile] = useState('');

const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;


const fetchBranches = async () => {
  try {
    const branchesResponse = await fetch(apiBaseUrl + `/branches?repoUrl=${encodeURIComponent(repoUrl)}`);
    const branchesData = await branchesResponse.json();
    setBranches(branchesData.branches);
    setPrs([]);
    setSelectedBranch('');
    setSelectedPr('');
  } catch (error) {
    console.error('Error fetching branches:', error);
  }
};

const fetchPrs = async (branch) => {
  try {
    const prsResponse = await fetch(apiBaseUrl + `/prs?repoUrl=${encodeURIComponent(repoUrl)}&branch=${encodeURIComponent(branch)}`);
    const prsData = await prsResponse.json();
    setPrs(prsData.prs);
  } catch (error) {
    console.error('Error fetching PRs:', error);
  }
};


const fetchDiffs = async () => {
  try {
    const response = await fetch(
      apiBaseUrl + `/compare?repoUrl=${encodeURIComponent(repoUrl)}&branch=${selectedBranch}&pr=${selectedPr}`
    );
    const data = await response.json();
    if (data.error) {
      console.error(data.error);
      setDiffs([]);
    } else {
      setDiffs(data); // Directly set the diff data returned by the API
    }
  } catch (error) {
    console.error('Error fetching diffs:', error);
    setDiffs([]);
  }
};



return (
  <div>
  <h1>Git Repo, Branch, and PR Diff Tool</h1>

  <div>
    <input
      type="text"
      value={repoUrl}
      onChange={(e) => setRepoUrl(e.target.value)}
      placeholder="Enter GitHub repo URL (e.g. https://github.com/user/repo.git)"
    />
    <button onClick={fetchBranches}>Fetch Repo and Branches</button>
  </div>

  {branches.length > 0 && (
    <div>
      <label>
        Select Branch:
        <select
          value={selectedBranch}
          onChange={(e) => {
            const branch = e.target.value;
            setSelectedBranch(branch);
            fetchPrs(branch);
          }}
        >
          <option value="">--Select Branch--</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </label>
    </div>
  )}

  {selectedBranch && prs.length > 0 && (
    <div>
      <label>
        Select PR:
        <select value={selectedPr} onChange={(e) => setSelectedPr(e.target.value)}>
          <option value="">--Select PR--</option>
          {prs.map((pr) => (
            <option key={pr.number} value={pr.number}>
              {pr.title} (#{pr.number})
            </option>
          ))}
        </select>
      </label>
    </div>
  )}

  {selectedBranch && selectedPr && (
    <button onClick={fetchDiffs}>Compare Branch and PR</button>
  )}

  {
    selectedBranch && selectedPr && diffs.length > 0 &&
    <div>
    <label>
      Select File: 
      <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)}>
        <option value="">--Select File--</option>
        {diffs.length > 0 && diffs.map((fileDiff, index) => (
          <option key={`file-select-${index}`} value={fileDiff.file}>
            {`${fileDiff.file}${fileDiff.onlyFormattingChanges ? ` (Only formatting changes)` : ''}`}
          </option>
        ))}
      </select>
    </label>
  </div>}


  <div>
      {diffs.length > 0 && selectedFile && (
        <DiffViewer
          oldContent={diffs?.find((fileDiff) => fileDiff?.file === selectedFile)?.branchContent}
          newContent={diffs?.find((fileDiff) => fileDiff?.file === selectedFile)?.prContent}
          fileName={selectedFile}
        />
      )}
      
  </div>
</div>
);
}

export default App;