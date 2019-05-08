//
//  ViewController.swift
//  simpleiosapp
//
//  Created by Anton Aleksandrov on 5/6/19.
//  Copyright © 2019 Anton Aleksandrov. All rights reserved.
//

import UIKit
import IBMCloudAppID
import BMSCore

class ViewController: UIViewController, AuthorizationDelegate {
    func onAuthorizationCanceled() {
        print("onAuthorizationCanceled")
        authResultLabel.text = "onAuthorizationCanceled";
    }
    
    func onAuthorizationFailure(error: AuthorizationError) {
        print("onAuthorizationFailure")
        authResultLabel.text = "onAuthorizationFailure";
    }
    
    func onAuthorizationSuccess(accessToken: AccessToken?, identityToken: IdentityToken?, refreshToken: RefreshToken?, response: Response?) {
        print("onAuthorizationSuccess")
        DispatchQueue.main.async {
            self.authResultLabel.text = "Hello " + (identityToken?.name)!;
            self.loginButton.isHidden = true
        }
    }
    
    @IBOutlet weak var authResultLabel: UILabel!
    @IBOutlet weak var loginButton: UIButton!

    @IBAction func loginButtonClicked(_ sender: Any) {
        print("clicked")
        authResultLabel.text = "Authentication in progress...";
        AppID.sharedInstance.loginWidget?.launch(delegate: self)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }


}

