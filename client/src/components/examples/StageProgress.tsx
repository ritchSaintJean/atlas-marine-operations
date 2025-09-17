import StageProgress from '../StageProgress';

export default function StageProgressExample() {
  const stages = [
    {
      id: "protection",
      name: "Protection",
      status: "completed" as const,
      completedItems: 5,
      totalItems: 5,
    },
    {
      id: "blasting", 
      name: "Blasting",
      status: "active" as const,
      completedItems: 3,
      totalItems: 6,
    },
    {
      id: "painting",
      name: "Painting",
      status: "pending" as const,
      completedItems: 0,
      totalItems: 4,
    },
    {
      id: "cleaning",
      name: "Cleaning",
      status: "pending" as const,
      completedItems: 0,
      totalItems: 3,
    }
  ];

  return (
    <div className="p-4">
      <StageProgress stages={stages} currentStageId="blasting" />
    </div>
  );
}