<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Check the health of the application
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function check()
    {
        $health = [
            'status' => 'healthy',
            'timestamp' => now()->toIso8601String(),
            'services' => []
        ];

        // Check database connection
        try {
            DB::connection()->getPdo();
            $health['services']['database'] = [
                'status' => 'up',
                'message' => 'Database connection successful'
            ];
        } catch (\Exception $e) {
            $health['status'] = 'unhealthy';
            $health['services']['database'] = [
                'status' => 'down',
                'message' => 'Database connection failed: ' . $e->getMessage()
            ];
        }

        // Check cache
        try {
            cache()->put('health_check', 'ok', 1);
            $cacheValue = cache()->get('health_check');

            $health['services']['cache'] = [
                'status' => $cacheValue === 'ok' ? 'up' : 'down',
                'message' => $cacheValue === 'ok' ? 'Cache is working' : 'Cache check failed'
            ];
        } catch (\Exception $e) {
            $health['status'] = 'unhealthy';
            $health['services']['cache'] = [
                'status' => 'down',
                'message' => 'Cache check failed: ' . $e->getMessage()
            ];
        }

        // Application info
        $health['application'] = [
            'name' => config('app.name'),
            'environment' => config('app.env'),
            'debug' => config('app.debug'),
            'version' => '1.0.0'
        ];

        $statusCode = $health['status'] === 'healthy' ? 200 : 503;

        return response()->json($health, $statusCode);
    }
}
