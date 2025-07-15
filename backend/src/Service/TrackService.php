<?php

namespace App\Service;

use App\Entity\Track;
use App\Repository\TrackRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TrackService
{
    public function __construct(
        private TrackRepository $trackRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {
    }

    public function createTrack(array $data): Track
    {
        $track = new Track();
        $this->populateTrack($track, $data);
        
        $errors = $this->validator->validate($track);
        
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            throw new \InvalidArgumentException(implode(', ', $errorMessages));
        }

        $this->entityManager->persist($track);
        $this->entityManager->flush();

        return $track;
    }

    public function updateTrack(Track $track, array $data): Track
    {
        $this->populateTrack($track, $data);
        
        $errors = $this->validator->validate($track);
        
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            throw new \InvalidArgumentException(implode(', ', $errorMessages));
        }

        $this->entityManager->flush();

        return $track;
    }

    private function populateTrack(Track $track, array $data): void
    {
        if (isset($data['title'])) {
            $track->setTitle($data['title']);
        }

        if (isset($data['artist'])) {
            $track->setArtist($data['artist']);
        }

        if (isset($data['duration'])) {
            $track->setDuration((int) $data['duration']);
        }

        if (isset($data['isrc'])) {
            $track->setIsrc($data['isrc'] ?: null);
        }
    }
}
