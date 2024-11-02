import './Loading.css';

const Loading = () => {
  const letters = ['L', 'O', 'A', 'D', 'I', 'N', 'G'];

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex space-x-2 text-white text-4xl font-sans">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="loading-text"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loading;
