<?php

namespace App\Controller;

use App\Entity\Track;
use App\Repository\TrackRepository;
use App\Service\TrackService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Nelmio\CorsBundle\Annotation\Cors;

#[Route('/api/tracks')]
#[Cors(
    origins: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    headers: ["Content-Type", "Authorization"]
)]
class TrackController extends AbstractController
{
    public function __construct(
        private TrackRepository $trackRepository,
        private TrackService $trackService,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'api_tracks_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $tracks = $this->trackRepository->findAll();
        
        return $this->json($tracks, Response::HTTP_OK);
    }

    #[Route('', name: 'api_tracks_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $track = $this->trackService->createTrack($data);
            return $this->json($track, Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/{id}', name: 'api_tracks_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $track = $this->trackRepository->find($id);
        
        if (!$track) {
            return $this->json(['error' => 'Track not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $updatedTrack = $this->trackService->updateTrack($track, $data);
            return $this->json($updatedTrack, Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
