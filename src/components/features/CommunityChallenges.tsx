import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, CheckCircle, XCircle } from 'lucide-react';

const mockChallenges = [
  {
    id: '1',
    name: '7-Day Focus Streak',
    description: 'Stay focused for 7 days in a row and log your progress daily.',
    participants: 124,
    joined: false,
    progress: 0,
    leaderboard: [
      { name: 'Alice', score: 7 },
      { name: 'Bob', score: 6 },
      { name: 'You', score: 3 },
      { name: 'Eve', score: 2 },
    ],
  },
  {
    id: '2',
    name: 'Daily Reading Challenge',
    description: 'Read at least 10 pages every day for a week.',
    participants: 98,
    joined: false,
    progress: 0,
    leaderboard: [
      { name: 'Sam', score: 7 },
      { name: 'You', score: 5 },
      { name: 'Lily', score: 4 },
    ],
  },
];

export const CommunityChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [selected, setSelected] = useState<string | null>(null);

  const joinChallenge = (id: string) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, joined: true } : c));
  };
  const leaveChallenge = (id: string) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, joined: false, progress: 0 } : c));
    setSelected(null);
  };
  const logProgress = (id: string) => {
    setChallenges(challenges.map(c =>
      c.id === id && c.joined ? { ...c, progress: c.progress + 1 } : c
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Community Challenges</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map(challenge => (
          <Card key={challenge.id}>
            <CardHeader>
              <CardTitle>{challenge.name}</CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-blue-100 text-blue-800">{challenge.participants} participants</Badge>
                {challenge.joined && <Badge className="bg-green-100 text-green-800">Joined</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {challenge.joined ? (
                <>
                  <div className="mb-2">
                    <span className="font-medium">Your Progress:</span> {challenge.progress} days
                  </div>
                  <Button size="sm" className="mb-2" onClick={() => logProgress(challenge.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" /> Log Today
                  </Button>
                  <Button size="sm" variant="outline" className="ml-2 mb-2" onClick={() => leaveChallenge(challenge.id)}>
                    <XCircle className="h-4 w-4 mr-1" /> Leave
                  </Button>
                  <div className="mt-4">
                    <div className="font-semibold mb-1">Leaderboard</div>
                    <ul className="space-y-1">
                      {challenge.leaderboard.map((entry, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className={entry.name === 'You' ? 'font-bold text-blue-700' : ''}>{entry.name}</span>
                          <span className="ml-auto">{entry.score} days</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Button onClick={() => joinChallenge(challenge.id)}>
                  Join Challenge
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 