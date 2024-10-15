import ReactDiffViewer from 'react-diff-viewer-continued';
// import Prism from 'prismjs';
// import 'prismjs/themes/prism-okaidia.css'; // Prism theme
// import 'prismjs/components/prism-javascript'; // Include the language you want to highlight
// // Add more languages if needed like below
// // import 'prismjs/components/prism-python';
// // import 'prismjs/components/prism-css'; 

const DiffViewer = ({ oldContent, newContent, fileName }) => {

  // Function to highlight content using Prism
//   const highlightSyntax = (str) => {
//     return <pre dangerouslySetInnerHTML={{ __html: Prism.highlight(str, Prism.languages.javascript, 'javascript') }} />;
//   };

  return (
    <ReactDiffViewer
      oldValue={oldContent}
      newValue={newContent}
      splitView={true}
      useDarkTheme={true}
      leftTitle={fileName}
      rightTitle={fileName}
    //   renderContent={highlightSyntax}  // Highlight the content
    
    />
  );
};

export default DiffViewer;
