﻿using UnityEngine;
using UnityEngine.UI;

namespace FIMSpace.FLook
{
    public class FLookAnimator_DemoUI : MonoBehaviour
    {
        public Toggle headSpine;
        public Slider rotationSpeed;
        public Slider animationBlend;
        public Toggle rotAsOffsets;
        public Toggle anchor;
        public Slider compensation;

        [Space(10f)]
        public FLookAnimator headLook;
        public FLookAnimator spineLook;

        private bool switchingComponents = false;

        void Update()
        {
            FLookAnimator activeTarget;

            if (!switchingComponents)
            {
                if (headSpine.isOn)
                {
                    if (!headLook.enabled)
                    {
                        headLook.SwitchLooking(true);
                        spineLook.SwitchLooking(false, 0.2f, SwitchingFinished);
                        headLook.enabled = true;
                        switchingComponents = true;
                    }
                }
                else
                {
                    if (!spineLook.enabled)
                    {
                        spineLook.SwitchLooking(true);
                        headLook.SwitchLooking(false, 0.2f, SwitchingFinished);
                        spineLook.enabled = true;
                        switchingComponents = true;
                    }
                }

                if (headSpine.isOn) activeTarget = headLook; else activeTarget = spineLook;

                activeTarget.RotationSpeed = rotationSpeed.value;
                activeTarget.BlendToOriginal = animationBlend.value;

                activeTarget.AnimateWithSource = rotAsOffsets.isOn;
                activeTarget.AnchorReferencePoint = anchor.isOn;

                activeTarget.CompensationWeight = compensation.value;
            }

        }

        void SwitchingFinished()
        {
            switchingComponents = false;
            if (headSpine.isOn) spineLook.enabled = false; else headLook.enabled = false;
        }
    }
}