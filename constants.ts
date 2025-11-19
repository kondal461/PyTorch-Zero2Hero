import { Difficulty, CurriculumModule } from './types';

export const CURRICULUM: CurriculumModule[] = [
  {
    difficulty: Difficulty.BASICS,
    topics: [
      {
        id: 'tensors-intro',
        title: 'Introduction to Tensors',
        difficulty: Difficulty.BASICS,
        prompt: 'Explain PyTorch Tensors. Include how to create them from lists and numpy arrays, and basic properties like shape, dtype, and device. Provide clear code examples.'
      },
      {
        id: 'tensor-ops',
        title: 'Tensor Operations',
        difficulty: Difficulty.BASICS,
        prompt: 'Explain basic tensor operations in PyTorch: addition, matrix multiplication, reshaping, and indexing. Compare in-place vs out-of-place operations.'
      },
      {
        id: 'autograd',
        title: 'Autograd: Automatic Differentiation',
        difficulty: Difficulty.BASICS,
        prompt: 'Explain torch.autograd. How do gradients work? Explain .requires_grad, .backward(), and .grad. Provide a simple example calculating a derivative.'
      }
    ]
  },
  {
    difficulty: Difficulty.INTERMEDIATE,
    topics: [
      {
        id: 'linear-regression',
        title: 'Linear Regression from Scratch',
        difficulty: Difficulty.INTERMEDIATE,
        prompt: 'Walk through creating a Linear Regression model in PyTorch using only tensors and autograd first, then introduce torch.nn.Linear.'
      },
      {
        id: 'nn-module',
        title: 'The nn.Module Class',
        difficulty: Difficulty.INTERMEDIATE,
        prompt: 'Explain the torch.nn.Module class. How to define a custom model, the __init__ method, and the forward method. Show a simple Feed Forward Neural Network.'
      },
      {
        id: 'optimizers-loss',
        title: 'Optimizers and Loss Functions',
        difficulty: Difficulty.INTERMEDIATE,
        prompt: 'Explain torch.optim (SGD, Adam) and Loss functions (MSELoss, CrossEntropyLoss). Show a standard training loop.'
      }
    ]
  },
  {
    difficulty: Difficulty.ADVANCED,
    topics: [
      {
        id: 'cnns',
        title: 'Convolutional Neural Networks',
        difficulty: Difficulty.ADVANCED,
        prompt: 'Explain CNNs in PyTorch using Conv2d, MaxPool2d. Build a simple classifier for MNIST-like data.'
      },
      {
        id: 'custom-datasets',
        title: 'Custom Datasets & DataLoaders',
        difficulty: Difficulty.ADVANCED,
        prompt: 'Explain torch.utils.data.Dataset and DataLoader. How to create a custom dataset class with __len__ and __getitem__.'
      },
      {
        id: 'vaes',
        title: 'Variational Autoencoders (VAEs)',
        difficulty: Difficulty.ADVANCED,
        prompt: 'Explain Variational Autoencoders (VAEs) in PyTorch. Cover the encoder-decoder structure, the reparameterization trick, and the Evidence Lower Bound (ELBO) loss function. Provide a clean code example.'
      },
      {
        id: 'gans',
        title: 'Generative Adversarial Networks (GANs)',
        difficulty: Difficulty.ADVANCED,
        prompt: 'Explain Generative Adversarial Networks (GANs). Describe the adversarial training process between Generator and Discriminator, and the loss function. Implement a basic GAN in PyTorch.'
      }
    ]
  },
  {
    difficulty: Difficulty.EXPERT,
    topics: [
      {
        id: 'transformers-nlp',
        title: 'Transformer Models (NLP)',
        difficulty: Difficulty.EXPERT,
        prompt: 'Explain the Transformer architecture for NLP in PyTorch. Explain Self-Attention, Multi-Head Attention, and Positional Encoding. Show how to use torch.nn.Transformer or implement the attention mechanism.'
      },
      {
        id: 'vision-transformers',
        title: 'Vision Transformers (ViT)',
        difficulty: Difficulty.EXPERT,
        prompt: 'Explain Vision Transformers (ViT). Describe the process of splitting images into patches and linear embedding. Compare with CNNs and provide a PyTorch implementation structure.'
      },
      {
        id: 'llm-finetuning',
        title: 'Fine-Tuning LLMs (LoRA/PEFT)',
        difficulty: Difficulty.EXPERT,
        prompt: 'Explain how to fine-tune open-source Large Language Models (LLMs) like Llama using PyTorch. Introduce Parameter-Efficient Fine-Tuning (PEFT) and LoRA (Low-Rank Adaptation). Provide a code example using Hugging Face PEFT library with PyTorch.'
      },
      {
        id: 'distributed',
        title: 'Distributed Training (DDP)',
        difficulty: Difficulty.EXPERT,
        prompt: 'Explain the concepts of DistributedDataParallel (DDP) in PyTorch. Why is it needed? Show a conceptual code snippet for setup.'
      },
      {
        id: 'custom-autograd',
        title: 'Custom Autograd Functions',
        difficulty: Difficulty.EXPERT,
        prompt: 'Explain how to define custom torch.autograd.Function subclasses with static forward and backward methods.'
      },
      {
        id: 'quantization',
        title: 'Model Quantization',
        difficulty: Difficulty.EXPERT,
        prompt: 'Explain model quantization in PyTorch to reduce model size and increase inference speed. Dynamic vs Static quantization.'
      }
    ]
  }
];