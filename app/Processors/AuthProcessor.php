<?php

namespace App\Processors;

use Illuminate\Http\Request;
use Laravel\Passport\Http\Controllers\AccessTokenController;
use Symfony\Bridge\PsrHttpMessage\Factory\PsrHttpFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Nyholm\Psr7\Factory\Psr17Factory;

class AuthProcessor
{
    /**
     * Attempt to log in using Passport's password grant flow by directly invoking the token issuance.
     *
     * @param Request $request
     * @return array|false Returns the token response array on success, or false on failure.
     */

    public function attemptLogin(Request $request)
    {
        // Merge the OAuth parameters your password grant needs
        $request->merge([
            'grant_type'    => 'password',
            'client_id'     => config('passport.password_client_id'),
            'client_secret' => config('passport.password_client_secret'),
            'username'      => $request->input('email'),
            'password'      => $request->input('password'),
            'scope'         => '',
        ]);

        // 1) Convert the Illuminate Request to a PSR‑7 request
        $psr17Factory   = new Psr17Factory();
        $psrHttpFactory = new PsrHttpFactory($psr17Factory, $psr17Factory, $psr17Factory, $psr17Factory);
        $psrRequest     = $psrHttpFactory->createRequest($request);

        // 2) Call the AccessTokenController with the PSR‑7 request
        $accessTokenController = app(AccessTokenController::class);
        // In most Passport versions, this will return an Illuminate\Http\Response
        $illuminateResponse = $accessTokenController->issueToken($psrRequest);

        // 3) Decode the JSON response from the Illuminate response
        $data = json_decode($illuminateResponse->getContent(), true);

        // 4) Check for errors
        if (isset($data['error'])) {
            return false;  // e.g. "invalid_client" or "invalid_grant"
        }

        return $data;  // Access token, refresh token, etc.
    }



    /**
     * Retrieve the token's Time-To-Live (TTL) in seconds.
     *
     * @return int
     */
    public function getTokenTTL(): int
    {
        // You can adjust this value via configuration.
        return config('passport.token_ttl', 3600);
    }
}
